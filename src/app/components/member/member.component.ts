import {Component, input} from '@angular/core';
import {Member} from "../../../Model";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup, MatCardXlImage
} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {MemberDetailedComponent} from "../member-detailed/member-detailed.component";
import {ImageLoaderComponent} from "../image-loader/image-loader.component";

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardXlImage,
    NgOptimizedImage,
    ImageLoaderComponent
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
  memberData = input.required<Member>()
  role = input<string>()
  subteamRole = input<string>()

  constructor(public dialog: MatDialog) {
  }

  openDialog() {
    const dialogRef = this.dialog.open(MemberDetailedComponent, {
      data: this.memberData()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
