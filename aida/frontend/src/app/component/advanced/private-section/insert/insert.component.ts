import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalDialogComponent } from 'src/app/component/basic/modal-dialog/modal-dialog.component';
import { News } from 'src/app/model/news';
import { People } from 'src/app/model/people';
import { Research } from 'src/app/model/research';
import { GeneralService } from 'src/app/service/general.service';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {


  imageSource;
  title;
  description;
  name;
  surname;
  year;
  role;
  email;
  number;
  additionalInfo;

  selected;

  showPeople: boolean = false;
  showNews: boolean = false;
  showResearch: boolean = false;

  state: any

  constructor(private generalService: GeneralService, public dialog: MatDialog, public router: Router, private location: Location) {
    this.state = this.location.getState();
    if (!this.state.user) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.showNews = true
  }

  async uploadListener($event: any) {
    let files = $event.srcElement.files;
    let img = await this.convertBase64(files[0])
    this.imageSource = img
  }

  clear() {
    this.imageSource = null;
    this.title = null;
    this.description = null;
    this.name = null;
    this.surname = null;
    this.year = null;
    this.role = null;
    this.email = null;
    this.number = null;
    this.additionalInfo = null;
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

  selection() {
    if (this.selected == 'news') {
      this.showNews = true
      this.showPeople = false
      this.showResearch = false
    }
    else if (this.selected == 'research') {
      this.showResearch = true
      this.showNews = false
      this.showPeople = false
    }
    else if (this.selected == 'people') {
      this.showPeople = true
      this.showNews = false
      this.showResearch = false
    }
  }

  saveNews() {
    let obj: News = new News(this.title, this.description, this.imageSource)
    this.generalService.saveNews(obj).subscribe(res => {
      this.openDialog()
      this.router.navigate(['/private']);
    })
  }

  saveResearch() {
    let obj: Research = new Research(this.title, this.description, this.year, this.imageSource)
    this.generalService.saveResearch(obj).subscribe(res => {
      this.openDialog()
      this.router.navigate(['/private']);
    })
  }

  savePeople() {
    let obj: People = new People(this.name, this.surname, this.email, this.number, this.additionalInfo, this.role, this.imageSource)
    this.generalService.savePeople(obj).subscribe(res => {
      this.openDialog()
      this.router.navigate(['/private']);
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

  back() {
    this.router.navigate(['/private'], { state: { user: this.state } })
  }


}