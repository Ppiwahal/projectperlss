import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cm-update-demo-info',
  templateUrl: './cm-update-demo-info.component.html',
  styleUrls: ['./cm-update-demo-info.component.scss']
})
export class CmUpdateDemoInfoComponent implements OnInit, OnDestroy {
  customValidation = customValidation;
  paeId: string;
  submitted = false;
  personData;
  subscribed: Array<Subscription> = [];
  iAccept = false;
  buttonId;
  subscriptions$ = [];
  firstPanel = false;
  secondPanel = false;

  constructor(private fb: FormBuilder,
              private changeManagementService: ChangeManagementService,
              private router: Router) { }

  ngOnInit(): void {
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        console.log(personData);
        this.personData = personData;
        if (this.personData.postSearchPersonId === 'Y') {
          this.firstPanel = true;
          this.secondPanel = false;
        } else {
          this.firstPanel = false;
          this.secondPanel = true;
        }
      })
    );

  }

  onClick() {
  }

  submit() {
    delete this.personData.postSearchPersonId;
    const submitDemoInfoSubscriptions = this.changeManagementService.submitDemoInfo(this.personData).subscribe(res => {
      if(res){
        this.router.navigate(['ltss/changeManagement/dashboard']);
      }
    });
    this.subscriptions$.push(submitDemoInfoSubscriptions);
    // this.router.navigate(['ltss/changeManagement/dashboard']);
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
