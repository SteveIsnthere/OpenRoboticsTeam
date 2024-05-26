import {Injectable, signal, WritableSignal} from '@angular/core';
import {Overview} from "../../Model";
import {apiEndPoint} from "../../main";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  overview: WritableSignal<Overview> = signal({members: [], projects: [], roles: [], subteams: [], subteam_roles: []})
  isAdmin: WritableSignal<boolean> = signal(true)

  constructor(private http: HttpClient) {
    this.http.get(apiEndPoint + "/overview/data").subscribe((data) => {
      const overview = data as Overview
      this.overview.set(overview)
    })
  }
}
