import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppealService } from '../../services/appeal.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-appeal-resolution-approval',
    templateUrl: './appeal-resolution-approval.component.html',
    styleUrls: ['./appeal-resolution-approval.component.scss'],
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

export class AppealResolutionApprovalComponent implements OnInit, OnDestroy {

    @Input() appellantInfo: any;
    @Output() appellantInfoUpdate = new EventEmitter();
    @Output() navigateBackToAppealHearing: EventEmitter<any> = new EventEmitter<any>();

    approvalForm: FormGroup;
    isNoActionPending = false;
    isSubmit = false;
    isNext = false;
    appealApproval: any;
    approvalReasonClarification: any;
    isUpdatePasrr = false;
    actionToCompleteAppealResolution: any;
    safetyAndScore: any;
    isLocResNonLocPNMPS = false;
    departmentApprovingPasrr: any;
    minDate: any;
    isShowErrors = false;
    customValidation = customValidation;
    subscriptions$ = [];
    startDate = new Date();

    constructor(private appealService: AppealService,
                private toastrService: ToastrService,
                private formBuilder: FormBuilder,
                private router: Router) { }

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
        this.getApprovalReason();
        this.getAppealClosureClarification();
        this.getResolutionAction();
        this.getSafetyAndScore();
        this.getDepartmentApprovingPasrr();
        this.approvalForm = this.formBuilder.group({
            approvalReason: ['', Validators.required],
            approvalClarificationReason: ['', Validators.required],
            appealResolutionAction: ['', Validators.required],
            departmentApprovingPASRR: [''],
            PASRRResubmissionDate: [''],
            approvedClientId: [''],
            approvedEpisodeId: [''],
            approvalComments: ['', Validators.required],
            PASRRApprovedBasedOn: [''],
            actionTaken: [''],
            PASRREffectiveDate: [''],

            PASRREffectiveApprovalDate: [''],
            PASRRApprovalComments: ['']
        });
    }

    getApprovalReason() {
        const ApprovalReasonSubscriptions = this.appealService.getStaticDataValue('APPEAL_APPROVAL').subscribe(response => {
            this.appealApproval = response;
        });
        this.subscriptions$.push(ApprovalReasonSubscriptions);
    }

    getAppealClosureClarification() {
        const AppealClosureClarificationSubscriptions$ = this.appealService.getStaticDataValue('APPEAL_CLOSURE_CLARIFICATION')
            .subscribe(response => {
                this.approvalReasonClarification = response;
            });
        this.subscriptions$.push(AppealClosureClarificationSubscriptions$);
    }

    getResolutionAction() {
        const ResolutionActionSubscriptions = this.appealService.getStaticDataValue('RESOLUTION_ACTION').subscribe(response => {
            this.actionToCompleteAppealResolution = response;
        });
        this.subscriptions$.push(ResolutionActionSubscriptions);
    }

    getSafetyAndScore() {
        const SafetyAndScoreSubscriptions = this.appealService.getStaticDataValue('PASRR_APPROVED').subscribe(response => {
            this.safetyAndScore = response;
        });
        this.subscriptions$.push(SafetyAndScoreSubscriptions);
    }

    getDepartmentApprovingPasrr() {
        const EntitySubscriptions = this.appealService.getStaticDataValue('ENTITY').subscribe(response => {
            this.departmentApprovingPasrr = response;
        });
        this.subscriptions$.push(EntitySubscriptions);
    }

    onApprovalReasonChange(event) {
        this.approvalForm.get('departmentApprovingPASRR').clearValidators();
        this.approvalForm.get('PASRRResubmissionDate').clearValidators();
        this.approvalForm.get('PASRREffectiveApprovalDate').clearValidators();
        this.approvalForm.get('approvedClientId').clearValidators();
        this.approvalForm.get('approvedEpisodeId').clearValidators();
        if (event.value === 'PAL' || event.value === 'PAN' || event.value === 'PAP') {
            this.isLocResNonLocPNMPS = true;
            this.approvalForm.get('departmentApprovingPASRR').setValidators(Validators.required);
            this.approvalForm.get('PASRRResubmissionDate').setValidators(Validators.required);
            this.approvalForm.get('PASRREffectiveApprovalDate').setValidators(Validators.required);
            this.approvalForm.get('approvedClientId').setValidators(Validators.required);
            this.approvalForm.get('approvedEpisodeId').setValidators(Validators.required);
        } else {
            this.isLocResNonLocPNMPS = false;
        }
        this.approvalForm.get('departmentApprovingPASRR').updateValueAndValidity();
        this.approvalForm.get('PASRRResubmissionDate').updateValueAndValidity();
        this.approvalForm.get('PASRREffectiveApprovalDate').updateValueAndValidity();
        this.approvalForm.get('approvedClientId').updateValueAndValidity();
        this.approvalForm.get('approvedEpisodeId').updateValueAndValidity();
    }

    onAppealResolutionChange(event) {
        this.isNoActionPending = false;
        this.isNext = false;
        this.isSubmit = false;
        this.isUpdatePasrr = false;
        this.approvalForm.get('PASRREffectiveDate').clearValidators();
        this.approvalForm.get('PASRRApprovedBasedOn').clearValidators();
        this.approvalForm.get('PASRRApprovalComments').clearValidators();
        this.approvalForm.get('actionTaken').clearValidators();
        if (event.value === 'UP') {
            this.isUpdatePasrr = true;
            this.approvalForm.get('PASRREffectiveDate').setValidators(Validators.required);
            this.approvalForm.get('PASRRApprovedBasedOn').setValidators(Validators.required);
            this.approvalForm.get('PASRRApprovalComments').setValidators(Validators.required);
        }
        if (event.value === 'UR' || event.value === 'UA') {
            this.isNext = true;
        } else if (event.value === 'UE' || event.value === 'UP') {
            this.isSubmit = true;
        } else if (event.value === 'NAP') {
            this.isNoActionPending = true;
            this.approvalForm.get('actionTaken').setValidators(Validators.required);
        }
        this.approvalForm.get('PASRREffectiveDate').updateValueAndValidity();
        this.approvalForm.get('PASRRApprovedBasedOn').updateValueAndValidity();
        this.approvalForm.get('PASRRApprovalComments').updateValueAndValidity();
        this.approvalForm.get('actionTaken').updateValueAndValidity();
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
        if (this.approvalForm.valid) {
            let passrResubmissionDate = '';
            let passrEffectiveDate = '';
            if (this.approvalForm.value.PASRRResubmissionDate !== '') {
                passrResubmissionDate = this.formatDate(this.approvalForm.value.PASRRResubmissionDate);
            }
            if (this.approvalForm.value.PASRREffectiveDate) {
                passrEffectiveDate = this.formatDate(this.approvalForm.value.PASRREffectiveDate);
            }
            const payload = {
                aplId: this.appellantInfo.aplId,
                resolutionRsnCd: 'AP',
                approvalRsnCd: this.approvalForm.value.approvalReason,
                approvalClrfcnRsnCd: this.approvalForm.value.approvalClarificationReason,
                deptApprovingPasrrCd: this.approvalForm.value.departmentApprovingPASRR ? this.approvalForm.value.departmentApprovingPASRR : '',
                pasrrRsbmsnDt: passrResubmissionDate,
                pasrrEffectiveDt: passrEffectiveDate,
                clientId: this.approvalForm.value.approvedClientId ? this.approvalForm.value.approvedClientId : '',
                approvedEpisodeId: this.approvalForm.value.approvedEpisodeId ? this.approvalForm.value.approvedEpisodeId : '',
                selectActionRsltnCd: this.approvalForm.value.appealResolutionAction,
                approvalComments: this.approvalForm.value.approvalComments,
                actionCloseComments: this.approvalForm.value.actionTaken ? this.approvalForm.value.actionTaken : '',
                basisPasrrApprovalCd: this.approvalForm.value.PASRRApprovedBasedOn ? this.approvalForm.value.PASRRApprovedBasedOn : ''
            };
            const AppealResolutionDetailsSubscriptions = this.appealService.saveAppealResolutionDetails(payload).subscribe(response => {
                this.toastrService.success(customValidation.B7);
                this.appellantInfoUpdate.emit(true);
                this.getAppealResolutionPDF();
            });
            this.subscriptions$.push(AppealResolutionDetailsSubscriptions);
        } else {
            Object.keys(this.approvalForm.controls).forEach(field => {
                const control = this.approvalForm.get(field);
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

    debugBase64(base64URL){
        const win = window.open();
        win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
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
        this.router.navigate(['ltss/adjudicationDetail']);
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
