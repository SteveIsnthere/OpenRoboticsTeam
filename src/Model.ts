export interface Project {
  id?: number;
  name: string;
  is_robo_cup: boolean;
  is_completed: boolean;
  description?: string;
  image?: string;
  github?: string;
  weblink?: string;
  time: Date;
  subteams: Subteam[];
  project_roles: ProjectRole[];
}

export interface Member {
  id?: number;
  name: string;
  is_captain: boolean;
  is_retired: boolean;
  discipline?: string;
  bio?: string;
  image?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  weblink?: string;
  time: Date;
  project_roles: ProjectRole[];
  subteam_roles: SubteamRole[];
}

export interface ProjectRole {
  id?: number;
  is_lead: boolean;
  is_colead: boolean;
  name?: string;
  project_id: number;
  member_id: number;
  project: Project;
  member: Member;
}

export interface Subteam {
  id?: number;
  name: string;
  project_id: number;
  project: Project;
  subteam_roles: SubteamRole[];
}

export interface SubteamRole {
  id?: number;
  name?: string;
  subteam_id: number;
  member_id: number;
  subteam: Subteam;
  member: Member;
}
