import {Component, computed, Inject, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {Member} from "../../../Model";
import {ImageLoaderComponent} from "../image-loader/image-loader.component";
import {formatDateToMMDDYYYY} from "../../../main";

@Component({
  selector: 'app-member-detailed',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    ImageLoaderComponent
  ],
  templateUrl: './member-detailed.component.html',
  styleUrl: './member-detailed.component.scss'
})
export class MemberDetailedComponent {
  member = signal<Member | undefined>(undefined)
  dateJoined = computed(() => formatDateToMMDDYYYY(this.member()!.time))


  constructor(@Inject(MAT_DIALOG_DATA) public memberData: Member) {
    this.member.set(memberData)
  }
}
