import {Component, computed, Inject, Signal} from '@angular/core';
import {Member} from "../../../Model";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {MainService} from "../../services/main.service";
import {ImageLoaderComponent} from "../image-loader/image-loader.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {apiEndPoint} from "../../../main";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    ImageLoaderComponent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    CdkTextareaAutosize,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatSlideToggle
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent {
  member?: Member
  uniqueDisciplines: Signal<(string | undefined)[]> = computed(() => Array.from(new Set(this.main.overview().members.map((m) => m.discipline))))


  constructor(@Inject(MAT_DIALOG_DATA) public memberData: Member, private http: HttpClient, public main: MainService, private _snackBar: MatSnackBar) {
    this.member = memberData
  }

  submit() {
    this.http.put(apiEndPoint + "/members/update_member/" + this.member?.id, this.member).subscribe((res) => {
      if (res) {
        this._snackBar.open("Member Updated", "Close", {
          duration: 3000,
        });
      }
    })
  }
}
