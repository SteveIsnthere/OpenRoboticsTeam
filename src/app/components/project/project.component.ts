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
import {ImageLoaderComponent} from "../image-loader/image-loader.component";
import {formatDateToMMDDYYYY} from "../../../main";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ProjectDetailedComponent} from "../project-detailed/project-detailed.component";

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
    MatCardXlImage,
    ImageLoaderComponent,
    MatIcon
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  projectData = input.required<Project>()
  protected readonly formatDateToMMDDYYYY = formatDateToMMDDYYYY;

  constructor(public dialog: MatDialog) {
  }

  openDialog() {
    this.dialog.open(ProjectDetailedComponent, {
      data: this.projectData()
    });
  }
}
