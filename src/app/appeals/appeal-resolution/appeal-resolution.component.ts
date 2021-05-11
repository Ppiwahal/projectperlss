import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppealService } from '../services/appeal.service';
import { AppealStepper } from 'src/app/_shared/utility/AppealFlowSeq';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-appeal-resolution',
    templateUrl: './appeal-resolution.component.html',
    styleUrls: ['./appeal-resolution.component.scss'],
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

export class AppealResolutionComponent implements OnInit, OnDestroy, OnChanges {

    @Input() passrRefrenceTableData: any;
    @Input() appealId: any;
    @Input() appellantInfoStatus: any;
    @Output() completedAppealOnsiteAssessment: EventEmitter<any> = new EventEmitter<any>();

    appealReviewOnLoad: any;
    isAppealReviewOnLoad = false;
    reasonForAppeal: any;
    isClosure = false;
    isApproval = false;
    isHearing = false;
    appellantInfo: any;
    isAppellantInfo = false;
    subscriptions$ = [];

    constructor(private appealService: AppealService, private toastrService: ToastrService) { }

    ngOnInit() {
        this.reasonForAppealResolution();
    }

    ngOnChanges() {
        if (this.appealId) {
            this.getAppellantDetails();
            this.getAppealReviewOnLoad();
        }
    }

    getAppellantDetails() {
        this.appealService.getAppealDetails(this.appealId).subscribe(res => {
            this.appellantInfo = res;
            this.isAppellantInfo = true;
        });
    }

    getAppealReviewOnLoad() {
        const AppealReviewOnLoadSubscriptions$ = this.appealService.getAppealReviewOnLoad(this.appealId).subscribe(response => {
            this.appealReviewOnLoad = response;
            this.isAppealReviewOnLoad = true;
        });
        this.subscriptions$.push(AppealReviewOnLoadSubscriptions$);
    }

    reasonForAppealResolution() {
        const AppealResolutionSubscriptions$ = this.appealService.getStaticDataValue('APPEAL_RESOLUTION').subscribe(response => {
            this.reasonForAppeal = response;
        });
        this.subscriptions$.push(AppealResolutionSubscriptions$);
    }

    onReasonChange(event) {
        this.isApproval = false;
        this.isHearing = false;
        this.isClosure = false;
        if (event.value === 'CL') {
            this.isClosure = true;
        } else if (event.value === 'AP') {
            this.isApproval = true;
        } else if (event.value === 'HO') {
            this.isHearing = true;
        }
    }

    updateAppellantInfo(event) {
        this.isAppellantInfo = false;
        this.getAppellantDetails();
    }

    navigateBack() {
        const previousForm = 'APPEAL_HEARING';
        const nextStepperData = { nextStepper: AppealStepper[previousForm] };
        this.completedAppealOnsiteAssessment.emit(nextStepperData);
    }

    ngOnDestroy() {
        if (this.subscriptions$ && this.subscriptions$.length > 0) {
            this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
        }
    }

}
