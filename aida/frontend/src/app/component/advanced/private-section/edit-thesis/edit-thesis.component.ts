import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogComponent } from 'src/app/component/basic/modal-dialog/modal-dialog.component';
import { Thesis } from 'src/app/model/thesis';
import { GeneralService } from 'src/app/service/general.service';

@Component({
  selector: 'app-edit-thesis',
  templateUrl: './edit-thesis.component.html',
  styleUrls: ['./edit-thesis.component.css']
})
export class EditThesisComponent implements OnInit {

  imageSource;
  state;
  thesis;
  edit = false;

  requiredForm: FormGroup;

  constructor(private fb: FormBuilder, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private generalService: GeneralService, public dialog: MatDialog, public router: Router, private location: Location) {
    this.myForm()
  }

  ngOnInit(): void {
    this.state = this.location.getState();
    if (!this.state.user) {
      this.router.navigate(['/']);
    }
    this.activatedRoute.data.subscribe((response: any) => {
      this.thesis = response.thesis
      this.edit = false;
      this.imageSource = this.thesis.file != null ? this._sanitizer.bypassSecurityTrustUrl('data:image/png;base64' + this.thesis.file) : null
      this.setValue()
    });
  }

  myForm() {
    this.requiredForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(1024)])]
    });
  }

  setValue() {
    this.requiredForm.patchValue({ title: this.thesis.title, description: this.thesis.description })
  }

  async uploadListener($event: any) {
    let files = $event.srcElement.files;
    let img = await this.convertBase64(files[0])
    this.imageSource = img
    this.edit = true
  }

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  saveThesis() {
    let obj: Thesis = new Thesis(this.requiredForm.value.title, this.requiredForm.value.description, this.edit ? this.imageSource : this.thesis.file)
    this.generalService.editThesis(this.thesis.idThesis, obj).subscribe(res => {
      this.openDialog()
      this.edit = false;
      this.router.navigate(['/private'], { state: { user: this.state } });
    })
  }


  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '220px'
    dialogConfig.width = '600px'

    dialogConfig.data = {
      title: 'Operazione completata',
      message: 'Salvataggio effettuato correttamente.',
      class: 'success-class'
    };

    this.dialog.open(ModalDialogComponent, dialogConfig);

  }

  clear() {
    this.imageSource = null;
    this.requiredForm.reset()
  }

  back() {
    this.router.navigate(['/private'], { state: { user: this.state } })
  }

}