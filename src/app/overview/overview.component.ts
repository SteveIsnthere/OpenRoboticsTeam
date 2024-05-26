import {Component, computed, effect, Signal, signal, WritableSignal} from '@angular/core';
import {Member, Overview, Project, ProjectChunk, ProjectRole, Subteam, SubteamChunk, SubteamRole} from "../../Model";
import {MemberComponent} from "../components/member/member.component";
import {ProjectComponent} from "../components/project/project.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle,
  MatExpansionPanelHeader
} from "@angular/material/expansion";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MainService} from "../services/main.service";
import {FormsModule} from "@angular/forms";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup, MatCardXlImage
} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {formatDateToMMDDYYYY} from "../../main";


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    MemberComponent,
    ProjectComponent,
    MatProgressBar,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatDivider,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    MatCardXlImage,
    NgOptimizedImage
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  members: WritableSignal<Member[]> = signal([])
  projects: WritableSignal<Project[]> = signal([])
  projectRoles: WritableSignal<ProjectRole[]> = signal([])
  subteams: WritableSignal<Subteam[]> = signal([])
  subteamRoles: WritableSignal<SubteamRole[]> = signal([])

  canShowData: WritableSignal<boolean> = signal(false)

  captain: Signal<Member> = computed(() => this.members().filter((m) => m.is_captain)[0]);
  uniqueDisciplines: Signal<(string | undefined)[]> = computed(() => Array.from(new Set(this.members().map((m) => m.discipline))))
  // uniqueProjects: Signal<Project[]> = computed(() => this.main.overview().projects)
  uniqueRoles: Signal<(string | undefined)[]> = computed(() => Array.from(new Set(this.projectRoles().map((r) => r.name))))
  displayData: WritableSignal<ProjectChunk[]> = signal([])

  projectSelected: WritableSignal<number | undefined> = signal(undefined)
  disciplineSelected: WritableSignal<string | undefined> = signal(undefined)
  roleSelected: WritableSignal<string | undefined> = signal(undefined)

  finishedInit: WritableSignal<boolean> = signal(false)

  constructor(public main: MainService) {
    effect(() => {
      if (this.main.overview().members.length == 0 || this.finishedInit()) {
        return
      }
      this.load()
      this.finishedInit.set(true)
    }, {allowSignalWrites: true});
  }

  unpackOverview(overview: Overview) {
    this.members.set(overview.members)
    this.projects.set(overview.projects)
    this.projectRoles.set(overview.roles)
    this.subteams.set(overview.subteams)
    this.subteamRoles.set(overview.subteam_roles)
    console.log('Unpacked overview data')
  }

  loadDisplayData() {
    this.canShowData.set(false)
    let data: ProjectChunk[] = []
    for (const project of this.projects()) {
      const projectChunk: ProjectChunk = {project, subteams: [], members_no_subteam: []}
      let memberIDsWithSubteam = []
      for (const subteam of this.subteams().filter((s) => s.project_id === project.id)) {
        const subteamChunk: SubteamChunk = {subteam, members: []}
        for (const subteamRole of this.subteamRoles().filter((sr) => sr.subteam_id === subteam.id)) {
          const member = this.members().filter((m) => m.id === subteamRole.member_id)[0]
          if (!member) continue
          subteamChunk.members.push({member, subteam_role: subteamRole.name})
          memberIDsWithSubteam.push(member.id)
        }
        if (subteamChunk.members.length > 0) projectChunk.subteams.push(subteamChunk)
      }
      const memberIDsInProject = this.projectRoles().filter((pr) => pr.project_id === project.id).map((pr) => pr.member_id)
      const memberIDsNoSubteam = memberIDsInProject.filter((id) => !memberIDsWithSubteam.includes(id))
      if (memberIDsNoSubteam.length > 0) projectChunk.members_no_subteam.push(...this.members().filter((m) => memberIDsNoSubteam.includes(m.id!)))
      if (memberIDsInProject.length > 0) data.push(projectChunk)
    }
    this.displayData.set(data)
    this.canShowData.set(true)
  }

  reset() {
    this.projectSelected.set(undefined)
    this.disciplineSelected.set(undefined)
    this.roleSelected.set(undefined)
    this.load()
  }

  load() {
    this.unpackOverview(this.main.overview())
    this.loadDisplayData()
  }

  filterProjects() {
    this.projects.set(this.projects().filter((p) => p.id === this.projectSelected()))
    this.projectRoles.set(this.projectRoles().filter((r) => r.project_id === this.projectSelected()))
    this.members.set(this.members().filter((m) => this.projectRoles().map((pr) => pr.member_id).includes(m.id!)))
    this.loadDisplayData()
  }

  filterDisciplines() {
    this.members.set(this.members().filter((m) => m.discipline === this.disciplineSelected()))
    const memberIDs = this.members().map((m) => m.id)
    this.projectRoles.set(this.projectRoles().filter((pr) => memberIDs.includes(pr.member_id)))
    this.projects.set(this.projects().filter((p) => this.projectRoles().map((pr) => pr.project_id).includes(p.id!)))
    this.loadDisplayData()
  }

  filterRoles() {
    this.projectRoles.set(this.projectRoles().filter((pr) => pr.name === this.roleSelected()))
    this.members.set(this.members().filter((m) => this.projectRoles().map((pr) => pr.member_id).includes(m.id!)))
    this.projects.set(this.projects().filter((p) => this.projectRoles().map((pr) => pr.project_id).includes(p.id!)))
    this.loadDisplayData()
  }

  protected readonly formatDateToMMDDYYYY = formatDateToMMDDYYYY;
}
