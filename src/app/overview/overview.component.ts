import {Component, computed, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Member, Project, ProjectRole, Subteam, SubteamRole} from "../../Model";
import {MemberComponent} from "../components/member/member.component";
import {apiEndPoint} from "../../main";
import {ProjectComponent} from "../components/project/project.component";
import {MatProgressBar} from "@angular/material/progress-bar";

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
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    MemberComponent,
    ProjectComponent,
    MatProgressBar
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  members: WritableSignal<Member[]> = signal([])
  projects: WritableSignal<Project[]> = signal([])
  projectRoles: WritableSignal<ProjectRole[]> = signal([])
  subteams: WritableSignal<Subteam[]> = signal([])
  subteamRoles: WritableSignal<SubteamRole[]> = signal([])

  canShowData: WritableSignal<boolean> = signal(false)

  captain: Signal<Member> = computed(() => this.members().filter((m) => m.is_captain)[0]);
  displayData: WritableSignal<ProjectChunk[]> = signal([])

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get(apiEndPoint + "/overview/data").subscribe((data) => {
      const overview = data as Overview
      this.members.set(overview.members)
      this.projects.set(overview.projects)
      this.projectRoles.set(overview.roles)
      this.subteams.set(overview.subteams)
      this.subteamRoles.set(overview.subteam_roles)
      this.loadDisplayData()
    })
  }

  loadDisplayData() {
    let data: ProjectChunk[] = []
    for (const project of this.projects()) {
      const projectChunk: ProjectChunk = {project, subteams: []}
      for (const subteam of this.subteams().filter((s) => s.project_id === project.id)) {
        const subteamChunk: SubteamChunk = {subteam, members: []}
        for (const subteamRole of this.subteamRoles().filter((sr) => sr.subteam_id === subteam.id)) {
          const member = this.members().filter((m) => m.id === subteamRole.member_id)[0]
          if (!member) continue
          subteamChunk.members.push({member, subteam_role: subteamRole.name})
        }
        projectChunk.subteams.push(subteamChunk)
      }
      data.push(projectChunk)
    }
    this.displayData.set(data)
    this.canShowData.set(true)
  }
}
