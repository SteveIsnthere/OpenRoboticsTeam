import {Component, input} from '@angular/core';
import {Project} from "../../../Model";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup, MatCardXlImage
} from "@angular/material/card";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    MatCardXlImage
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  projectData = input.required<Project>()
}
