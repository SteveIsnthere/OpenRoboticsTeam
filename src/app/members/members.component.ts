import {Component, effect, OnInit, signal} from '@angular/core';
import {Member} from "../../Model";
import {MainService} from "../services/main.service";
import {HttpClient} from "@angular/common/http";
import {apiEndPoint} from "../../main";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ProjectComponent} from "../components/project/project.component";
import {MemberComponent} from "../components/member/member.component";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    MatSlideToggle,
    ProjectComponent,
    MemberComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatIcon,
    MatLabel,
    MatHint,
    FormsModule
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
  showRetired = signal(false);
  newestFirst = signal(false);

  inputName = '';
  members: Member[] = []
  retiredMembers: Member[] = []

  constructor(public main: MainService, private http: HttpClient) {
    effect(() => {
      if (this.showRetired()) {
        this.members = this.retiredMembers;
      } else {
        this.members = this.main.overview().members;
      }

      this.members = this.members.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
      if (!this.newestFirst()) {
        this.members = this.members.reverse();
      }
    })

    effect(() => {
      this.members = this.main.overview().members;
    });
  }

  ngOnInit() {
    this.http.get(apiEndPoint + '/members/get_retired_members').subscribe((data) => {
      this.retiredMembers = data as Member[];
    })
  }

  toggleRetired() {
    this.showRetired.set(!this.showRetired());
  }

  toggleNewestFirst() {
    this.newestFirst.set(!this.newestFirst());
  }

  searchMember() {
    let search = this.inputName
    if (search === '') {
      return;
    }
    this.http.post(apiEndPoint + '/members/get_members_with_name', search).subscribe((data) => {
      this.members = data as Member[];
    })
  }
}
