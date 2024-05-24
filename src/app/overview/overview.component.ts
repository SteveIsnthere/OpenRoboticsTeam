import {Component, computed, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Member, Project, ProjectRole, Subteam, SubteamRole} from "../../Model";
import {MemberComponent} from "../components/member/member.component";
import {apiEndPoint} from "../../main";
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

interface Overview {
  members: Member[]
  projects: Project[]
  roles: ProjectRole[]
  subteams: Subteam[]
  subteam_roles: SubteamRole[]
}

interface MemberChunk {
  member: Member
  subteam_role: string | undefined
}

interface SubteamChunk {
  subteam: Subteam
  members: MemberChunk[]
}

interface ProjectChunk {
  project: Project
  subteams: SubteamChunk[]
  members_no_subteam: Member[]
}

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
    MatOption
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  overview: WritableSignal<Overview> = signal({members: [], projects: [], roles: [], subteams: [], subteam_roles: []})

  members: WritableSignal<Member[]> = signal([])
  projects: WritableSignal<Project[]> = signal([])
  projectRoles: WritableSignal<ProjectRole[]> = signal([])
  subteams: WritableSignal<Subteam[]> = signal([])
  subteamRoles: WritableSignal<SubteamRole[]> = signal([])

  canShowData: WritableSignal<boolean> = signal(false)

  captain: Signal<Member> = computed(() => this.members().filter((m) => m.is_captain)[0]);
  uniqueDisciplines: Signal<(string | undefined)[]> = computed(() => Array.from(new Set(this.members().map((m) => m.discipline))))
  displayData: WritableSignal<ProjectChunk[]> = signal([])

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    if (this.overview().members.length > 0) {
      this.unpackOverview(this.overview())
      this.loadDisplayData()
      return
    }
    this.http.get(apiEndPoint + "/overview/data").subscribe((data) => {
      const overview = data as Overview
      this.overview.set(overview)
      this.unpackOverview(this.overview())
      this.loadDisplayData()
    })
  }

  unpackOverview(overview: Overview) {
    this.members.set(overview.members)
    this.projects.set(overview.projects)
    this.projectRoles.set(overview.roles)
    this.subteams.set(overview.subteams)
    this.subteamRoles.set(overview.subteam_roles)
  }

  loadDisplayData() {
    let data: ProjectChunk[] = []
    for (const project of this.projects()) {
      const projectChunk: ProjectChunk = {project, subteams: [], members_no_subteam: []}
      for (const subteam of this.subteams().filter((s) => s.project_id === project.id)) {
        const subteamChunk: SubteamChunk = {subteam, members: []}
        let memberIDsWithSubteam = []
        for (const subteamRole of this.subteamRoles().filter((sr) => sr.subteam_id === subteam.id)) {
          const member = this.members().filter((m) => m.id === subteamRole.member_id)[0]
          if (!member) continue
          subteamChunk.members.push({member, subteam_role: subteamRole.name})
          memberIDsWithSubteam.push(member.id)
        }

        const memberIDsInProject = this.projectRoles().filter((pr) => pr.project_id === project.id).map((pr) => pr.member_id)
        const memberIDsNoSubteam = memberIDsInProject.filter((id) => !memberIDsWithSubteam.includes(id))
        if (memberIDsNoSubteam.length > 0) {
          projectChunk.members_no_subteam.push(...this.members().filter((m) => memberIDsNoSubteam.includes(m.id!)))
        }
        projectChunk.subteams.push(subteamChunk)
      }
      data.push(projectChunk)
    }
    this.displayData.set(data)
    this.canShowData.set(true)
  }
}
