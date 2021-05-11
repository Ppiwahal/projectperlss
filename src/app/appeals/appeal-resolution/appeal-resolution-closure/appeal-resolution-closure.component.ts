import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppealService } from '../../services/appeal.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-appeal-resolution-closure',
    templateUrl: './appeal-resolution-closure.component.html',
    styleUrls: ['./appeal-resolution-closure.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})

export class AppealResolutionClosureComponent implements OnInit, OnDestroy {

    @Input() appellantInfo: any;
    @Output() navigateBackToAppealHearing: EventEmitter<any> = new EventEmitter<any>();
    @Output() appellantInfoUpdate = new EventEmitter();

    closureForm: FormGroup;
    closureReason: any;
    closureReasonClarification: any;
    isAgency = false;
    cobStatus: any;
    isShowCOB = false;
    isNoActionPending = false;
    isUpdatePasrrEnrollment = false;
    isAdjuKBReferral = false;
    actionToCompleteAppealResolution: any;
    agencyToHelp: any;
    isShowErrors = false;
    minDate: any;
    customValidation = customValidation;
    subscriptions$ = [];
    startDate = new Date();

    constructor(private appealService: AppealService, private toastrService: ToastrService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
        this.minDate = new Date('01/01/1901');
        this.getAppealClosure();
        this.getAppealClosureClarification();
        this.getCOBStatus();
        this.getResolutionAction();
        this.getAgencyToHelp();
        this.closureForm = this.formBuilder.group({
            closureReason: ['', Validators.required],
            closureClarificationReason: ['', Validators.required],
            appealResolutionAction: ['', Validators.required],
            agencyName: [''],
            closeCOB: [''],
            cobEndDate: [''],
            actionTaken: ['']
        });
        if (this.appellantInfo && this.appellantInfo.cobStatus) {
            if (this.appellantInfo.cobStatus === 'GT') {
                this.isShowCOB = true;
                this.closureForm.get('closeCOB').setValidators(Validators.required);
                this.closureForm.get('cobEndDate').setValidators(Validators.required);
                this.closureForm.get('cobEndDate').updateValueAndValidity();
                this.closureForm.get('closeCOB').updateValueAndValidity();
            }
        }
    }

    getAppealClosure() {
        const AppealClosureSubscriptions$ = this.appealService.getStaticDataValue('APPEAL_CLOSURE').subscribe(response => {
            this.closureReason = response;
        });
        this.subscriptions$.push(AppealClosureSubscriptions$);
    }

    getAppealClosureClarification() {
        const AppealClosureClarificationSubscriptions$ = this.appealService.getStaticDataValue('APPEAL_CLOSURE_CLARIFICATION')
            .subscribe(response => {
                this.closureReasonClarification = response;
            });
        this.subscriptions$.push(AppealClosureClarificationSubscriptions$);
    }

    getResolutionAction() {
        const ResolutionActionSubscriptions = this.appealService.getStaticDataValue('RESOLUTION_ACTION').subscribe(response => {
            this.actionToCompleteAppealResolution = response;
        });
        this.subscriptions$.push(ResolutionActionSubscriptions);
    }

    getCOBStatus() {
        const COBStatusSubscriptions$ = this.appealService.getStaticDataValue('COB_STATUS').subscribe(response => {
            this.cobStatus = response;
        });
        this.subscriptions$.push(COBStatusSubscriptions$);
    }

    getAgencyToHelp() {
        const EntitySubscriptions = this.appealService.getStaticDataValue('ENTITY').subscribe(response => {
            this.agencyToHelp = response;
        });
        this.subscriptions$.push(EntitySubscriptions);
    }

    onClosureReasonChange(event) {
        this.closureForm.get('agencyName').clearValidators();
        if (event.value === 'DNE' || event.value === 'UNF') {
            this.isAgency = true;
            this.closureForm.get('agencyName').setValidators(Validators.required);
        } else {
            this.isAgency = false;
        }
        this.closureForm.get('agencyName').updateValueAndValidity();
    }

    onAppealResolutionChange(event) {
        this.closureForm.get('actionTaken').clearValidators();
        this.isNoActionPending = false;
        this.isAdjuKBReferral = false;
        this.isUpdatePasrrEnrollment = false;
        if (event.value === 'NAP') {
            this.closureForm.get('actionTaken').setValidators(Validators.required);
            this.isNoActionPending = true;
        } else if (event.value === 'UP' || event.value === 'UE') {
            this.isUpdatePasrrEnrollment = true;
        } else {
            this.isAdjuKBReferral = true;
        }
        this.closureForm.get('actionTaken').updateValueAndValidity();
    }

    formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    closeAppeal() {
        if (this.closureForm.valid) {
            let cobDateEnd = '';
            if (this.closureForm.value.cobEndDate !== '') {
                cobDateEnd = this.formatDate(this.closureForm.value.cobEndDate);
            }
            const payload = {
                aplId: this.appellantInfo.aplId,
                resolutionRsnCd: 'CL',
                closureRsnCd: this.closureForm.value.closureReason,
                agencyHelpCd: this.closureForm.value.agencyName ? this.closureForm.value.agencyName : '',
                cobCloseSw: 'Y',
                cobEndDt: cobDateEnd,
                closureClrfcnRsnCd: this.closureForm.value.closureClarificationReason,
                selectActionRsltnCd: this.closureForm.value.appealResolutionAction,
                actionCloseComments: this.closureForm.value.actionTaken ? this.closureForm.value.actionTaken : ''
            };
            const AppealResolutionDetailsSubscriptions = this.appealService.saveAppealResolutionDetails(payload).subscribe(response => {
                this.getAppealResolutionPDF();
                this.appellantInfoUpdate.emit(true);
                this.toastrService.success(customValidation.B7);
            });
            this.subscriptions$.push(AppealResolutionDetailsSubscriptions);
        } else {
            Object.keys(this.closureForm.controls).forEach(field => {
                const control = this.closureForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
            this.isShowErrors = true;
        }
    }

    getAppealResolutionPDF() {
        const AppealResolutionPDFSubscriptions = this.appealService.getAppealResolutionPDF(this.appellantInfo.aplId).subscribe(response => {
            if (response && response.document) {
                this.debugBase64('data:application/pdf;base64,' + response.document);
            }
        });
        this.subscriptions$.push(AppealResolutionPDFSubscriptions);
    }

    debugBase64(base64URL) {
        const win = window.open();
        win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    }

    submit() {
        this.toastrService.error('Needs to be integrated');
    }

    next() {
        // this.paeCommonService.setPersonId(this.appellantInfo.prsnId);
        // this.paeCommonService.setPaeId(this.appellantInfo.paeId);
        // this.paeCommonService.setEntityId(this.entityId);
        // this.paeCommonService.setProgramName(element.enrollmentGroup);
        // this.paeCommonService.setTaskId(element.taskId);
        // this.paeCommonService.setRowElement(element);
        // this.paeCommonService.setTaskStatus(element.taskStatus);
        // this.paeCommonService.setTaskQueue(element.taskQueue);
        // this.paeCommonService.setAssignedUser(element.assignedUser);
        // this.paeCommonService.setAdjId(element.adjId);


        // start
        // this.referralService.setRefId('RF1000135');
        // const element = {
        //     personId: this.appellantInfo.prsnId,
        // };
        // this.referralService.setRowElement(element);
        // this.router.navigate(['ltss/adjudicationDetail']);
        this.toastrService.error('Needs to be integrated');
    }

    navigateBack() {
        this.navigateBackToAppealHearing.emit();
    }

    ngOnDestroy() {
        if (this.subscriptions$ && this.subscriptions$.length > 0) {
            this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
        }
    }

}
