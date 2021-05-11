import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomvalidationService } from '../../../../_shared/utility/customvalidation.service';
import * as customValidation from '../../../../_shared/constants/validation.constants';
import { RefEnterIntakeOutcome } from '../../../../_shared/model/RefEnterIntakeOutcome';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { ReferralService } from '../../../../core/services/referral/referral.service';
import { IntakeActionsService } from '../../../../core/services/referral/intake-actions/intake-actions.service';
import { Router } from '@angular/router';
import { IntakeOutcomeService } from 'src/app/core/services/referral/intake-outcome/intake-outcome.service';
import { MatDialog } from '@angular/material/dialog';
import { RightnavToggleService } from 'src/app/_shared/services/rightnav-toggle.service';
@Component({
  selector: 'app-referral-enter-intake-outcome',
  templateUrl: './referral-enter-intake-outcome.component.html',
  styleUrls: ['./referral-enter-intake-outcome.component.scss']
})
export class ReferralEnterIntakeOutcomeComponent implements OnInit, OnDestroy {

  constructor(private referralService: ReferralService,
    private intakeActionsService: IntakeActionsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private customValidationService: CustomvalidationService,
    private router: Router,
    private intakeOutcomeService: IntakeOutcomeService,
    public dialog: MatDialog,
    private rightnavToggleService: RightnavToggleService) { }
  // data
  INTAKE_VISIT_INCOMPLETE = [
    {
      code: 'UR',
      value: 'Unable to reach',
      activateSW: 'Y',
    },
    {
      code: 'DS',
      value: 'Discontinued intake per applicant request',
      activateSW: 'Y',
    },
    {
      code: 'OU',
      value: 'Out of state',
      activateSW: 'Y',
    },
  ];

  INTAKE_VISIT_INCOMPLETE_ENDED = [
    {
      code: 'DS',
      value: 'Discontinued intake per applicant request',
      activateSW: 'Y'
    },
    {
      code: 'OU',
      value: 'Out of state',
      activateSW: 'Y'
    },
    {
      code: 'UR',
      value: 'Unable to reach',
      activateSW: 'Y'
    },
    {
      code: 'EN',
      value: 'Closed due to existing enrollment',
      activateSW: 'Y'
    },
    {
      code: 'DC',
      value: 'Deceased',
      activateSW: 'Y'
    }
  ];

  CONTACT_METHOD = [
    {
      code: 'IP',
      value: 'In-person',
      activateSW: 'Y'
    },
    {
      code: 'TE',
      value: 'Telephone',
      activateSW: 'Y'
    },
    {
      code: 'VT',
      value: 'Virtual',
      activateSW: 'Y'
    }
  ];
  userTypeCd2 = [
    { code: 'MCO', value: 'New ECF CHOICES Intake', activateSW: 'Y' },
    { code: 'NRS', value: 'Nurse Review for ECF CHOICES', activateSW: 'Y' },
    { code: 'IRC', value: 'Complete IARC Review', activateSW: 'Y' },
    { code: 'AME', value: 'MCO - Amerigroup', activateSW: 'Y' },
    { code: 'BLU', value: 'MCO - BlueCare', activateSW: 'Y' },
    { code: 'UNT', value: 'MCO - UnitedHealthcare', activateSW: 'Y' },
    { code: 'DID', value: 'DIDD', activateSW: 'Y' }
  ];
  userTypeCd = [
    { code: 'MCO', taskMasterId: 1, activateSW: 'Y' },
    { code: 'NRS', taskMasterId: 3, activateSW: 'Y' },
    { code: 'IRC', taskMasterId: 4, activateSW: 'Y' }
  ];

  docLinks: Array<any> = [ {
    title: 'Mailed Letter',
    saved: false,
    showUnavailable: true,
    unavailable: false,
    type: 'cloud',
    cloudId: 'ML',
    id: 'mldocument'
  }];
  @Input() chmTypeCd: any;
  minDate: Date;
  maxDate: Date;
  customValidation = customValidation;
  enterIntakeOutcome: any;
  refId: any;
  entityId: any;
  assignedEntity: any;
  taskMasterIdValue: any;
  userTypeCdMap = new Map();
  userType: any;
  docLinkMap: any;
  documents: Array<any>;
  pageId: string = 'PRIOC';
  refData: any;

  // form
  enterIntakeOutcomeForm: FormGroup;
  contactAttemptOneForm: FormGroup;
  contactAttemptTwoForm: FormGroup;
  contactAttemptThreeForm: FormGroup;

  // boolean
  completedIntakeVisit = true;
  enterIntakeCompleted = false;
  enterIntakeSubmitted = false;
  proceedToIntakeOutcome = false;
  enterIntakeDataExists = false;
  enterIntakeFormIntialize = false;
  reasonForReassigmentButton = false;
  reasonForReassigmentDiv = false;
  enableSaveClick: boolean = false;
  unableToReachFlag : boolean = false;


  // Subscription
  subscriptions: Subscription[] = [];
  subscription1$: Subscription;
  subscription2$: Subscription;

  showSpinner = false;
  enableButton = true;

  ngOnInit() {
    let that = this;
      this.refId = this.referralService.getRefId();
      this.initializeEnterIntakeOutcomeForm();
         this.refData = {};
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    this.maxDate = new Date();
    this.refId = this.referralService.getRefId();

    this.taskMasterIdValue = this.referralService.getRowElement().taskQueue;
    console.log(this.referralService.getRowElement());
    console.log(this.referralService.getRowElement().entityId);
    this.entityId = this.referralService.getRowElement().entityId;
    for (const code of this.userTypeCd) {
      this.userTypeCdMap.set(code.taskMasterId, code.code);
    }
    console.log("userTypeCdMap", this.userTypeCdMap.get(this.taskMasterIdValue));
    this.userType = this.userTypeCdMap.get(this.taskMasterIdValue);
    let entityName = this.referralService.getAssignedEntity();
    console.log(this.referralService.getAssignedEntity());
    if (this.taskMasterIdValue === 1 || this.taskMasterIdValue === 6) {
      // if (this.entityId === 4001) {
      //   this.userType = 'AME';
      // }
      // else if (this.entityId === 4002) {
      //   this.userType = 'BLU'
      // }
      // else if (this.entityId === 4003) {
      //   this.userType = 'UNT'
      // }
      // else if (this.entityId === 7001) {
      //   this.userType = 'DID'
      // }
      // else {
      //   this.userType = null
      // }
      if(entityName === 'Amerigroup'){
        this.userType = 'AMU';
      }
      else if (entityName === 'BlueCare') {
          this.userType = 'BLU'
      }
      else if (entityName === 'UnitedHealthcare') {
          this.userType = 'UNT'
      }
      else if (entityName === 'DIDD') {
        this.userType = 'DID'
      } else {
        this.userType = null
      }
    }
    if (this.taskMasterIdValue === 3) {
      this.userType = 'NRS';
    }
    if (this.taskMasterIdValue === 4) {
      this.userType = 'IRC';
    }
    if (this.taskMasterIdValue === undefined) {
      this.userType = null
    }

    this.referralService.setUserTypeCd(this.userType);

    console.log(this.userType);

    // Task ID - 1 , 3, 4, 6
    // 1, 6 -> entity ID -> 4001 -> usertype CD AME
    // 4002 -> Bluecare
    // 4003 -> uhc
    // 7001 -> DIDD

    // 3-> USERTYPE CD NRS
    // 4-> IRC

    // ? -> userTypeCD = null.
    this.getIntakeOutcomeData();

    this.docLinkMap = {};
    this.docLinks.forEach(function (el, index) {
      that.docLinkMap[el.id] = index;
    });
    this.addDocuments(['mldocument*opt']);

    this.referralService.getApplicantDetails(this.refId, this.pageId).then(response => {
      let data = response.body;
      this.refData['applicantDetails'] = data;
    }).catch(reason => {
      console.log('getApplicantDetails error: ' + reason);
    });
  }

  getIntakeOutcomeData() {
    this.subscription1$ = this.intakeActionsService
      .getIntakeActionsEnterIntakeOutcome(this.refId)
      .subscribe((enterIntakeOutcomeResponse) => {
        this.enterIntakeOutcome = enterIntakeOutcomeResponse;
        if (enterIntakeOutcomeResponse !== undefined) {
          if (enterIntakeOutcomeResponse != null) {
            if (!enterIntakeOutcomeResponse.hasOwnProperty('errorCode')) {
              this.enterIntakeOutcome = enterIntakeOutcomeResponse;
              this.initializeEnterIntakeOutcomeForm();
              this.enterIntakeCompleted = true;
              if (enterIntakeOutcomeResponse.flag
                && enterIntakeOutcomeResponse.flag === 'Y') {
                this.enterIntakeDataExists = true;
                this.reasonForReassigmentButton = true;
                console.log(this.reasonForReassigmentButton, this.contactAttemptThreeForm, this.contactAttemptOneForm, this.contactAttemptTwoForm);
              }

              if (this.enterIntakeOutcome.visitCompleteSw === 'Y') {
                this.enterIntakeOutcomeForm.patchValue(this.enterIntakeOutcome);
                this.completedIntakeVisit = true;
              }
              if (this.enterIntakeOutcome.intakeOutcomeId !== null && this.enterIntakeOutcome.visitCompleteSw === 'N') {
                this.enterIntakeOutcomeForm.patchValue(this.enterIntakeOutcome);
                this.completedIntakeVisit = false;
              }
              if(this.enterIntakeOutcome.rsnCd && this.enterIntakeOutcome.rsnCd=="UR"){
                this.unableToReachFlag = true;
              }else {
                this.unableToReachFlag = false;
              }
              console.log(this.enterIntakeOutcome);

              if (this.referralService.getUserTypeCd()
                && (this.referralService.getUserTypeCd() === 'NRS'
                  || this.referralService.getUserTypeCd() === 'IRC')) {
                this.reasonForReassigmentDiv = true;
              }

            }
          }
          if (enterIntakeOutcomeResponse == null) {
            this.initializeEnterIntakeOutcomeForm();
            this.enterIntakeCompleted = true;
          }
        }
      }, err => {
        this.initializeEnterIntakeOutcomeForm();
        this.enterIntakeCompleted = true;
      });
    this.subscriptions.push(this.subscription1$);
  }

  initializeEnterIntakeOutcomeForm() {
    this.enterIntakeOutcomeForm = this.fb.group({
      visitCompleteSw: ['', [Validators.required]],
      rsnCd: [''],
      intakeVisitComptdDt: [''],
      typeOfCntctCd: ['']
    });

    this.contactAttemptOneForm = this.fb.group({
      cntctAttempt: [1],
      cntctDtTime: [''],
      cntctTypeCd: [''],
      cntctdBy: [''],
      refId: [this.refId]
    });

    this.contactAttemptTwoForm = this.fb.group({
      cntctAttempt: [2],
      cntctDtTime: [''],
      cntctTypeCd: [''],
      cntctdBy: [''],
      refId: [this.refId]
    });

    this.contactAttemptThreeForm = this.fb.group({
      cntctAttempt: [3],
      cntctDtTime: [''],
      cntctTypeCd: [''],
      cntctdBy: [''],
      refId: [this.refId]
    });

    this.enterIntakeFormIntialize = true;

  }

  getEnterIntakeOutcomeParentForm() {
    return this.enterIntakeOutcomeForm.controls;
  }
  getTableRowOneForm() {
    return this.contactAttemptOneForm.controls;
  }
  getTableRowTwoForm() {
    return this.contactAttemptTwoForm.controls;
  }
  getTableRowThreeForm() {
    return this.contactAttemptThreeForm.controls;
  }

  onIntakeVisitCompletion(mrChange: MatRadioChange) {
    if (mrChange.value === 'Y') {
      this.completedIntakeVisit = true;
      
      this.setParentFormValidators();
      this.removeTableRowValidators();
      console.log(this.getEnterIntakeOutcomeParentForm());
      


    } else if (mrChange.value === 'N') {
      this.completedIntakeVisit = false;
      this.removeParentFormValidators();
      this.setTableRowValidators();
    }
  }

  setTableRowValidators() {
    this.getEnterIntakeOutcomeParentForm().rsnCd.setValidators([Validators.required]);
    this.getTableRowOneForm().cntctDtTime.setValidators([Validators.required,
    this.customValidationService.datePriorToInitialDate()]);
    this.getTableRowOneForm().cntctTypeCd.setValidators([Validators.required]);
    this.getTableRowOneForm().cntctdBy.setValidators([Validators.required]);

    this.getTableRowTwoForm().cntctDtTime.setValidators([Validators.required,
    this.customValidationService.datePriorToInitialDate()]);
    this.getTableRowTwoForm().cntctTypeCd.setValidators([Validators.required]);
    this.getTableRowTwoForm().cntctdBy.setValidators([Validators.required]);

    this.getTableRowThreeForm().cntctDtTime.setValidators([Validators.required,
    this.customValidationService.datePriorToInitialDate()]);
    this.getTableRowThreeForm().cntctTypeCd.setValidators([Validators.required]);
    this.getTableRowThreeForm().cntctdBy.setValidators([Validators.required]);

    this.getTableRowOneForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowOneForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowOneForm().cntctdBy.updateValueAndValidity();

    this.getTableRowTwoForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowTwoForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowTwoForm().cntctdBy.updateValueAndValidity();

    this.getTableRowThreeForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowThreeForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowThreeForm().cntctdBy.updateValueAndValidity();

    this.getEnterIntakeOutcomeParentForm().rsnCd.updateValueAndValidity();
  }

  removeTableRowValidators() {
    this.getEnterIntakeOutcomeParentForm().rsnCd.clearValidators();
    this.getTableRowOneForm().cntctDtTime.clearValidators();
    this.getTableRowOneForm().cntctTypeCd.clearValidators();
    this.getTableRowOneForm().cntctdBy.clearValidators();

    this.getTableRowTwoForm().cntctDtTime.clearValidators();
    this.getTableRowTwoForm().cntctTypeCd.clearValidators();
    this.getTableRowTwoForm().cntctdBy.clearValidators();

    this.getTableRowThreeForm().cntctDtTime.clearValidators();
    this.getTableRowThreeForm().cntctTypeCd.clearValidators();
    this.getTableRowThreeForm().cntctdBy.clearValidators();

    this.getTableRowOneForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowOneForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowOneForm().cntctdBy.updateValueAndValidity();

    this.getTableRowTwoForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowTwoForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowTwoForm().cntctdBy.updateValueAndValidity();

    this.getTableRowThreeForm().cntctDtTime.updateValueAndValidity();
    this.getTableRowThreeForm().cntctTypeCd.updateValueAndValidity();
    this.getTableRowThreeForm().cntctdBy.updateValueAndValidity();

    this.getEnterIntakeOutcomeParentForm().rsnCd.updateValueAndValidity();


  }

  setParentFormValidators() {
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.setValidators([Validators.required,
    this.customValidationService.datePriorToInitialDate()]);
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.setValidators([Validators.required]);
    
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.updateValueAndValidity();
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.updateValueAndValidity();
    
  }

  removeParentFormValidators() {
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.clearValidators();
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.clearValidators();
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.markAsUntouched();
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.markAsUntouched();
    
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.updateValueAndValidity();
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.updateValueAndValidity();
    
  }

  intakeOutcome() {
    this.proceedToIntakeOutcome = true;
    this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.markAsTouched();
    this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.markAsTouched();
    console.log(this.enterIntakeOutcomeForm);
    if(this.enterIntakeOutcomeForm.get('intakeVisitComptdDt').valid
      && this.enterIntakeOutcomeForm.get('typeOfCntctCd').valid){
      this.enterIntakeOutcomeSubmit();
      console.log(this.enterIntakeOutcomeForm);
      }
  }
  enterIntakeOutcomeSubmit() {
    this.enterIntakeSubmitted = true;
	this.showSpinner = true;
	this.enableButton = false;
    console.log(this.enterIntakeOutcomeForm.value);
    const refEnterIntakeOutcome = new RefEnterIntakeOutcome(
      this.refId,
      this.getEnterIntakeOutcomeParentForm().visitCompleteSw.value,
      this.getEnterIntakeOutcomeParentForm().rsnCd.value,
      this.getEnterIntakeOutcomeParentForm().typeOfCntctCd.value,
      this.getEnterIntakeOutcomeParentForm().intakeVisitComptdDt.value,
      [this.contactAttemptOneForm.value, this.contactAttemptTwoForm.value, this.contactAttemptThreeForm.value],
      this.userType,
      null
    );
    const myArray = Object.values(refEnterIntakeOutcome);
    console.log(myArray);
    this.subscription2$ = this.intakeActionsService
      .postEnterIntakeOutcome(refEnterIntakeOutcome)
      .subscribe((refEnterIntakeOutcomeResponse) => {
        console.log('success');
		this.showSpinner = false;
		this.enableButton = true;
        if (this.getEnterIntakeOutcomeParentForm().visitCompleteSw.value === 'Y') {
          this.referralService.setIntakeOutcomeId(refEnterIntakeOutcomeResponse.intakeOutcomeId);
          console.log(this.referralService.getIntakeOutcomeId());
          this.router.navigate(['/ltss/referral/referralIntakeOutcome']);
        }
        else {
          this.router.navigate(['/ltss/referral/referralDashboard']);
        }

      }, err => {
        console.log('error');
      });
    this.subscriptions.push(this.subscription2$);
  }

  addDocuments(docs: Array<string>, append: boolean = false) {
    let documents = append ? JSON.parse(JSON.stringify(this.documents)) : [];
    for (var i = 0; i < docs.length; i++) {
      let split = docs[i].split('*');
      let docId = split[0];
      let notRequired = split[1] == 'opt';
      let doc = this.docLinks[this.docLinkMap[docId]];
      if (!doc) {
        console.log('bad docId:' + docId);
      } else {
        doc.required = !notRequired;
        documents.push(doc);
      }
    }
    this.documents = documents;
    this.documentCount();
  }


  documentCount() {
    let length = this.documents.length;
    let missing = length == 0;
    for (var i = 0; i < length && !missing; i++) {
      let document = this.documents[i];
      if (document.required && (
        !document.saved && document.type == 'popup' ||
        !document.saved && document.type == 'cloud' && !document.unAvailable
      )
      ) {
        missing = true;
      }
    }
    this.enableSaveClick = !missing;
  }

  docLinkCloudLoad(event: Event) {
    let control = event.currentTarget as HTMLLabelElement;
    let index = control.getAttribute('index');
    this.rightnavToggleService.emitToRightNavComp$.next('UPLOAD_DOC');
  }

  onProvideAReasonChange(event) {
    if(event.source.value && event.source.value=="UR"){
      this.unableToReachFlag = true;
    }else {
      this.unableToReachFlag = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Unsubscribed');
  }


}
