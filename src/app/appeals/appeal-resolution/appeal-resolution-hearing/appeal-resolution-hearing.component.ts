import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppealService } from '../../services/appeal.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as customValidation from '../../../_shared/constants/validation.constants';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-appeal-resolution-hearing',
    templateUrl: './appeal-resolution-hearing.component.html',
    styleUrls: ['./appeal-resolution-hearing.component.scss'],
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

export class AppealResolutionHearingComponent implements OnInit, OnDestroy {

    @Input() appellantInfo: any;
    @Output() appellantInfoUpdate = new EventEmitter();
    @Output() navigateBackToAppealHearing: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    hearingForm: FormGroup;
    dataSourceHearingOrder: MatTableDataSource<any>;
    hearingOrderTable = ['orderType', 'order', 'issuedDate', 'userActions'];
    actionToCompleteAppealResolution: any;
    isShowCOB = false;
    isNoActionPending = false;
    isNext = false;
    isSubmit = false;
    isShowApprovalComments = false;
    entityId: any;
    cobStatus: any;
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
        const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
        this.entityId = JSON.parse(localStorageforLocal).entityId;
        this.getResolutionAction();
        this.getAppealHearingOrderDetails();
        this.getCOBStatus();
        this.hearingForm = this.formBuilder.group({
            closeCOB: [''],
            cobEndDate: [''],
            appealResolutionAction: ['', Validators.required],
            orderImplementationDate: ['', Validators.required],
            actionTaken: ['']
        });
    }

    getCOBStatus() {
        const COBStatusSubscriptions$ = this.appealService.getStaticDataValue('COB_STATUS').subscribe(response => {
            this.cobStatus = response;
        });
        this.subscriptions$.push(COBStatusSubscriptions$);
    }

    getAppealHearingOrderDetails() {
        const AppealHearingOrderDetailsSubscriptions = this.appealService.getAppealHearingOrderDetails(this.appellantInfo.aplId)
        .subscribe(response => {
            if (response && response.aplHrngDtlsId) {
                const arrayRequest = [];
                arrayRequest.push(response);
                if (this.appellantInfo && this.appellantInfo.cobStatus && response.orderTypeCd) {
                    if (this.appellantInfo.cobStatus === 'GT' && response.orderTypeCd === 'Test') {
                        this.isShowCOB = true;
                        this.hearingForm.get('closeCOB').setValidators(Validators.required);
                        this.hearingForm.get('cobEndDate').setValidators(Validators.required);
                        this.hearingForm.get('cobEndDate').updateValueAndValidity();
                        this.hearingForm.get('closeCOB').updateValueAndValidity();
                    }
                }
                this.dataSourceHearingOrder = new MatTableDataSource(arrayRequest);
                this.dataSourceHearingOrder.paginator = this.paginator;
            }
            console.log(response);
        });
        this.subscriptions$.push(AppealHearingOrderDetailsSubscriptions);
    }

    getResolutionAction() {
        const ResolutionActionSubscriptions = this.appealService.getStaticDataValue('RESOLUTION_ACTION').subscribe(response => {
            this.actionToCompleteAppealResolution = response;
        });
        this.subscriptions$.push(ResolutionActionSubscriptions);
    }

    onAppealResolutionChange(event) {
        this.isNoActionPending = false;
        this.isNext = false;
        this.isSubmit = false;
        this.hearingForm.get('actionTaken').clearValidators();
        if (event.value === 'UR' || event.value === 'UA') {
            this.isNext = true;
        } else if (event.value === 'UE' || event.value === 'UP') {
            this.isSubmit = true;
        } else if (event.value === 'NAP') {
            this.hearingForm.get('actionTaken').setValidators(Validators.required);
            this.isNoActionPending = true;
        }
        this.hearingForm.get('actionTaken').updateValueAndValidity();
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
        if (this.hearingForm.valid) {
            let cobDateEnd = '';
            let orderImplementationDate = '';
            if (this.hearingForm.value.cobEndDate !== '') {
                cobDateEnd = this.formatDate(this.hearingForm.value.cobEndDate);
            }
            if (this.hearingForm.value.orderImplementationDate !== '') {
                orderImplementationDate = this.formatDate(this.hearingForm.value.orderImplementationDate);
            }
            const payload = {
                aplId: this.appellantInfo.aplId,
                resolutionRsnCd: 'HO',
                cobCloseSw: 'Y',
                actionCloseComments: this.hearingForm.value.actionTaken ? this.hearingForm.value.actionTaken : '',
                cobEndDt: cobDateEnd,
                selectActionRsltnCd: this.hearingForm.value.appealResolutionAction,
                orderImplmtnDt: orderImplementationDate
            };
            const AppealResolutionDetailsSubscriptions = this.appealService.saveAppealResolutionDetails(payload).subscribe(response => {
                this.getAppealResolutionPDF();
                this.appellantInfoUpdate.emit(true);
                this.toastrService.success(customValidation.B7);
            });
            this.subscriptions$.push(AppealResolutionDetailsSubscriptions);
        } else {
            Object.keys(this.hearingForm.controls).forEach(field => {
                const control = this.hearingForm.get(field);
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

    viewDetails(element) {
        console.log(element);
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
        // this.router.navigate(['ltss/adjudicationDetail']);
        this.router.navigate(['/ltss/referral/referralIntakeOutcome']);
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
