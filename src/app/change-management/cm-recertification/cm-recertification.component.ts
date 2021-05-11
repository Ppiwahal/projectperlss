import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'app-cm-recertification',
  templateUrl: './cm-recertification.component.html',
  styleUrls: ['./cm-recertification.component.scss']
})
export class CmRecertificationComponent implements OnInit {
  subscribed: Array<Subscription> = [];
  personData: any;
  chmTypeCd:string = 'RECT';

  constructor(private paeCommonService: PaeCommonService,
              private changeManagementService: ChangeManagementService,
              private router: Router, ) { }


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
 this.paeCommonService.setPaeStatus(this.personData.paeStatus);
 this.paeCommonService.setPersonId(this.personData.personId);
 console.log("this.personData.personId", this.personData.personId);
 this.router.navigate(['/ltss/pae/paeStart/paeReviewSubmit']);
  }
}
