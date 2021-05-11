import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { AddOrUpdateMedicaidOnlyPayerDate } from 'src/app/_shared/model/change-management/addOrUpdateMedicaid';

@Component({
  selector: 'app-cm-add-update-mopd',
  templateUrl: './cm-add-update-mopd.component.html',
  styleUrls: ['./cm-add-update-mopd.component.scss']
})
export class CmAddUpdateMopdComponent implements OnInit {
  subscribed: Array<Subscription> = [];
  personData: any;
  myForm: FormGroup;
  submitted: boolean;
  chmTypeCd:string = 'AOUM';

  constructor(
    private router: Router,
    private paeCommonService: PaeCommonService,
    private fb: FormBuilder,
    private changeManagementService: ChangeManagementService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      chmTypeCd: [''],
      commentTxt: [''],
      enrollmentTypeCd: [''],
      entityCd: [''],
      paeId: [''],
      prsnId: [''],
      refId: [''],
      userId: ['']
    });
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        console.log('this.personData', this.personData);
      })
    );
  }

  getFormData() {
    return this.myForm.controls;
  }

  save() {
    this.submitted = true;
    this.paeCommonService.setPaeId(this.personData.paeId);
    this.paeCommonService.setProgramName(this.personData.enrollmentGroup);
    this.paeCommonService.setPaeStatus(this.personData.paeStatus);
    this.paeCommonService.setChmTypeCd(this.chmTypeCd);
    console.log("setChmTypeCd(this.chmTypeCd)", this.chmTypeCd)
    console.log(this.getFormData());
    if (this.myForm.valid) {
      const addOrUpdateMedicaidOnlyPayerDate = new AddOrUpdateMedicaidOnlyPayerDate(
        this.chmTypeCd,
        this.getFormData().commentTxt.value,
        this.personData.enrollmentTypeCd,
        this.getFormData().entityCd.value,
        this.personData.paeId,
        this.personData.prsnId,
        this.getFormData().refId.value,
        this.getFormData().userId.value,

      );
      this.changeManagementService.SaveAddOrUpdateMedicaid(addOrUpdateMedicaidOnlyPayerDate).then((response) => {
        console.log('res', response, this.personData);
        this.router.navigate(['/ltss/pae/paeStart/paeReviewSubmit']);
      });
    }
  }
}
