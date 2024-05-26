import {Component, computed, Inject, OnInit, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Member, Project} from "../../../Model";
import {ImageLoaderComponent} from "../image-loader/image-loader.component";
import {apiEndPoint, formatDateToMMDDYYYY} from "../../../main";
import {HttpClient} from "@angular/common/http";
import {ProjectComponent} from "../project/project.component";
import {MatIcon} from "@angular/material/icon";
import {MainService} from "../../services/main.service";
import {MemberEditComponent} from "../member-edit/member-edit.component";

@Component({
  selector: 'app-member-detailed',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    ImageLoaderComponent,
    ProjectComponent,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './member-detailed.component.html',
  styleUrl: './member-detailed.component.scss'
})
export class MemberDetailedComponent implements OnInit {
  member = signal<Member | undefined>(undefined)
  dateJoined = computed(() => formatDateToMMDDYYYY(this.member()!.time))

  projectsJoined: Project[] = []


  constructor(@Inject(MAT_DIALOG_DATA) public memberData: Member, private http: HttpClient, public main: MainService, private dialog: MatDialog) {
    this.member.set(memberData)
  }

  ngOnInit() {
    this.http.get<Project[]>(apiEndPoint + '/projects/get_projects_member_joined/' + this.member()?.id).subscribe(projects => {
      this.projectsJoined = projects
    })
  }

  editMember() {
    this.dialog.open(MemberEditComponent, {
      data: this.member()
    });
  }
}
