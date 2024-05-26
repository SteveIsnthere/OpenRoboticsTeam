import {Component, effect, OnInit, signal} from '@angular/core';
import {MainService} from "../services/main.service";
import {ProjectComponent} from "../components/project/project.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {HttpClient} from "@angular/common/http";
import {Project} from "../../Model";
import {apiEndPoint} from "../../main";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectComponent,
    MatSlideToggle
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  showRetired = signal(false);
  newestFirst = signal(false);

  projects: Project[] = []
  completedProjects: Project[] = []

  constructor(public main: MainService, private http: HttpClient) {
    effect(() => {
      if (this.showRetired()) {
        this.projects = this.completedProjects;
      } else {
        this.projects = this.main.overview().projects;
      }

      this.projects = this.projects.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
      if (!this.newestFirst()) {
        this.projects = this.projects.reverse();
      }
    })

    effect(() => {
      this.projects = this.main.overview().projects;
    });
  }

  ngOnInit() {
    this.http.get(apiEndPoint + '/projects/get/true').subscribe((data) => {
      this.completedProjects = data as Project[];
    })
  }

  toggleRetired() {
    this.showRetired.set(!this.showRetired());
  }

  toggleNewestFirst() {
    this.newestFirst.set(!this.newestFirst());
  }
}
