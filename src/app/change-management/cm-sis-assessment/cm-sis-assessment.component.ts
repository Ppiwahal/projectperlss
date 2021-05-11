import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-cm-sis-assessment',
  templateUrl: './cm-sis-assessment.component.html',
  styleUrls: ['./cm-sis-assessment.component.scss']
})
export class CmSisAssessmentComponent implements OnInit {
  subscribed: Array<Subscription> = [];
  personData: any;
  chmTypeCd:string = 'SISA';

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
 this.paeCommonService.setChmTypeCd(this.chmTypeCd);
 this.router.navigate(['/ltss/pae/paeStart/paeReviewSubmit']);
  }

}
