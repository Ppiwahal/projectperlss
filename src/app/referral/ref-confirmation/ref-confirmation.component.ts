import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferralService } from '../../core/services/referral/referral.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ref-confirmation',
  templateUrl: './ref-confirmation.component.html',
  styleUrls: ['./ref-confirmation.component.scss']
})
export class RefConfirmationComponent implements OnInit {
  constructor(private referralService: ReferralService,
              private toastrService: ToastrService,
              private router: Router) { }

  refId: string;

  ngOnInit(): void {
    this.refId=this.referralService.getRefId();
  }

  redirectDashboard(){
    this.router.navigate(['/ltss/referral/referralDashboard']);
  }

  generatePdf(){
    const response = this.referralService.createPdf();
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
