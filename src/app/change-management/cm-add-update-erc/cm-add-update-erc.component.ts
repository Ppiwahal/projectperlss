
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';

@Component({
  selector: 'cm-add-update-erc',
  templateUrl: './cm-add-update-erc.component.html'
})

export class CmAddUpdateErcComponent implements OnInit {
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
 this.router.navigate(['/ltss/pae/paeStart/enhancedRespiratoryCare']);
  }


}
