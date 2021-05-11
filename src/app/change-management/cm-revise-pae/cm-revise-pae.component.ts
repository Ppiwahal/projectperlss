import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-cm-revise-pae',
  templateUrl: './cm-revise-pae.component.html',
  styleUrls: ['./cm-revise-pae.component.scss']
})
export class CmRevisePaeComponent implements OnInit {
  subscribed: Array<Subscription> = [];
  personData: any;

  constructor(private router: Router,
              private paeCommonService: PaeCommonService, 
              private changeManagementService: ChangeManagementService) { }

  ngOnInit(): void {
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        console.log('this.personData', this.personData);
      })
    );
  }

  save() {
 this.paeCommonService.setPaeId(this.personData.paeId);
 this.paeCommonService.setProgramName(this.personData.enrollmentGroup);
 this.router.navigate(['/ltss/pae/paeStart/paeReviewSubmit']);
  }

}
