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
    NgOptimizedImage
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
  memberData = input.required<Member>()
  role = input<string>()
  subteamRole = input<string>()
}
