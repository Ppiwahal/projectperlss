import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsService } from './../../services/widgets/forms-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewFormDocument } from '../../../_shared/model/NewFormDocument';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
  documentForm: FormGroup;
  public icon = 'add_circle';
  editable: boolean;
  initialForm: boolean = true;
  files: any = [];
  showHide: boolean;
  formInformation: any;
  TST2: boolean;
  arrayToSend: any = [];
  // pdfValidationMesage;

  constructor(public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private formsService: FormsService) { }

  ngOnInit(): void {
    const response = this.formsService.getFormsDetails();
    response.then(data => {
      console.log(JSON.stringify(data));
      this.formInformation = data;
    });
    this.documentForm = this.fb.group({
      formDesc: [''],
    });
  }

  getFormData() {
    return this.documentForm.controls;
  }

  openFormsEdit() {
    this.editable = true;
    this.initialForm = false;
  }

  closePopup() {
    this.dialogRef.close();
  }

  toggleIcon() {
    if (this.icon === 'add_circle') {
      this.icon = 'remove_circle';
      this.showHide = true;
    } else {
      this.icon = 'add_circle';
      this.showHide = false;
    }
  }

  fileBrowseHandler(evt) { 
    var f = evt.target.files[0];
    if (f.type === evt.target.accept) {
      this.prepareFilesList(evt.target.files);
    } else {
      evt.target.value = "";
      // this.pdfValidationMesage = "Not a PDF File.!"
      //toster message
      console.log("Not a PDF file");
    }
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;

      this.files.push(item);
    }
    console.log(this.files);
  }

  //For conversion to base64
  handleFileSelect(evt) {
    // this.pdfValidationMesage = "";
    var f = evt.target.files[0];
    if (f.type === evt.target.accept) {
      var reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          var binaryData = e.target.result;
          var base64String = window.btoa(binaryData);
          console.log(base64String);
        };
      })(f);
      reader.readAsBinaryString(f);
    } else {
      evt.target.value = "";
      // this.pdfValidationMesage = "Not a PDF File.!"
      // toster message
      console.log("Not a PDF file");
    }
  }

  //Required for post call after B.E update
  postData() {
    const formDocVO = new NewFormDocument(
      0,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    this.arrayToSend.push(formDocVO);
    this.formsService.saveSupportFunctionsForm(this.arrayToSend);
    this.dialogRef.close();
  }

  runShowHide1(formCode) {
    this.TST2 = formCode;
    console.log(formCode);
  }

  downloadPdf(byteData, formCode) {
    var data = byteData;
    var pdfData = atob(data);
    console.log(pdfData)
    var file = new Blob([pdfData], { type: 'application/pdf' });
    var fileUrl = URL.createObjectURL(file);

    //open it via a link
    var fileName = formCode + ".pdf";
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  }

}
