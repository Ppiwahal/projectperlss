import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaeService } from '../../core/services/pae/pae.service';
import { Pae } from '../../_shared/model/Pae';
import {​​ PaeCommonService }​​ from '../../core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-pae-confirmation',
  templateUrl: './pae-confirmation.component.html',
  styleUrls: ['./pae-confirmation.component.scss']
  
})
export class PaeConfirmationComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paeService: PaeService,
	private paeCommonService: PaeCommonService
  ) { }

  paeId = this.paeCommonService.getPaeId();

  ngOnInit(): void {
    
  }

  next() {
    let that = this;
    this.router.navigate(['ltss/pae']);
  }

  generatePdf(){
    const response = this.paeService.createPdf();
    response.then(resp => {
      if(resp){
        console.log(resp);
        this.debugBase64('data:application/pdf;base64,' + resp.body[0].document);
      }      
    });
  }

  debugBase64(base64URL) {
    console.log(base64URL);
    const win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

}
