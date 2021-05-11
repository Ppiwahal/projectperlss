import {Component, OnInit, OnDestroy, ViewChild, ElementRef, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { PersonReconciliationService } from '../services/person-reconciliation.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-select-individuals',
  templateUrl: './select-individuals.component.html',
  styleUrls: ['./select-individuals.component.scss']
})
export class SelectIndividualsComponent implements OnInit, OnDestroy {
  selectIndividuals: FormGroup;
  customValidation = customValidation;
  //link = '';
  requestType;
  dataSource;
  loadSearchResults = false;
  subscriptions$ = [];
  showMsg = false;
  columnsToDisplay = ['sourceRecipientId', 'name', 'dateOfBirth', 'ssn', 'status', 'sourceSystemId', 'primary'];
  personId1: any;
  personId2: any;
  date: any;
  userId: any;
  serviceError: any;
  @ViewChild('reminderModal') reminderModal: ElementRef;
  personIdErrorMsg = '<p>The following Person ID(s) provided above were not found in the PERLSS MDM: @Ids </p> <br /> <p> Please re-enter the ID(s) you wish to link and try again </p>';
  serviceErrMsg = 'There was an issue contacting MDM - please report to your system administrator';
  personId: any;
  showPrimaryLinkError: boolean;
  showPrimaryUninkError: boolean;
  isServiceSuccess:boolean;

  constructor( private formBuilder: FormBuilder,
               private personReconciliationService: PersonReconciliationService,
               private route: ActivatedRoute,
               private toastr: ToastrService) {
                const searchParamsBySession = sessionStorage.getItem('ACTIVE_SESSION_DATA');
                const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParamsBySession, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
                const searchParamJson = JSON.parse(deCryptedSearchParams);
                console.log("searchParamJson", searchParamJson);
                if (searchParamJson) {
                  this.personId = searchParamJson.personId;
                  this.personId2 = searchParamJson.personId2;
                  this.requestType = searchParamJson.requestType;
                }
            }

  ngOnInit(): void {
    this.selectIndividuals = this.formBuilder.group({
      requestType: [''],
      firstPersonId: ['', Validators.required],
      secondPersonId: ['', Validators.required]
    });
    this.setPersonMatchDetails();
  }

  get f() {
    return this.selectIndividuals.controls;
  }

  setPersonMatchDetails(){
    this.selectIndividuals.controls.firstPersonId.setValue(this.personId);
    this.selectIndividuals.controls.secondPersonId.setValue(this.personId2);
  }

  handleSubmitDetails() {
    const observables = [];
    const personIds = [];
    this.loadSearchResults = false;
    this.serviceError = null;
    this.date = new Date();
    if (this.selectIndividuals && this.selectIndividuals.value.firstPersonId && this.selectIndividuals.value.secondPersonId) {
      personIds.push(this.selectIndividuals.value.firstPersonId);
      personIds.push(this.selectIndividuals.value.secondPersonId);
      personIds.forEach(personId => {
        const payload = {
          sourceSystemId: 'PERLSS',
          sourceRecipientId: personId,
          requestSourceData: 'BOTH',
          messageHeader: {
            referenceId: '10101',
            originatorId: 'ws-perlss',
            dateTimestamp: '2002-05-30T09:00:00'
          }
        };
        observables.push(this.personReconciliationService.getMDMRecipient(payload));
      });
      const MDMRecipientSubscriptions = forkJoin(observables).subscribe((res: any) => {
        const personIds = [];
        if (res[0] && res[0].errorCode && res[0].errorCode.length > 0) {
          personIds.push(this.selectIndividuals.value.firstPersonId);
        }
        if (res[1] && res[1].errorCode && res[1].errorCode.length > 0) {
          personIds.push(this.selectIndividuals.value.secondPersonId);
        }
        if (personIds.length > 0) {
          this.serviceError = this.personIdErrorMsg.replace('@Ids', personIds.join(','));
        } else {
          const recipientList = [];
          const perlssrecord1 = res[0].recipient.filter(resRecipient => resRecipient.sourceSystemId === 'PERLSS');
          const perlssrecord2 = res[1].recipient.filter(resRecipient => resRecipient.sourceSystemId === 'PERLSS');


          if (perlssrecord1 && perlssrecord1.length > 0) {
             const nonPerlRec =  res[0].recipient.filter(resRecipient => resRecipient.sourceSystemId !== 'PERLSS');
             if (nonPerlRec && nonPerlRec.length > 0) {
               perlssrecord1[0].sourceSystemId = nonPerlRec[0].sourceSystemId;
             }
             recipientList.push(perlssrecord1[0]);
          }
          if (perlssrecord2 && perlssrecord2.length > 0) {
              const nonPerlRec =  res[1].recipient.filter(resRecipient => resRecipient.sourceSystemId !== 'PERLSS');
              if (nonPerlRec && nonPerlRec.length > 0) {
                perlssrecord2[0].sourceSystemId = nonPerlRec[0].sourceSystemId;
              }

              recipientList.push(perlssrecord2[0]);
          }
          this.loadSearchResults = true;
          // MOCK
          recipientList[0].status = 'Active';
          recipientList[1].status = 'Active';
          //
          recipientList.forEach(recipient => recipient.checked = false);
          const matchedRecipient = recipientList.filter(recipient => recipient.status === 'Active' && recipient.sourceSystemId === 'TEDS');
          if (matchedRecipient && matchedRecipient.length === 1) {
            matchedRecipient[0].checked = true;
          }
          this.dataSource = recipientList;
        }
      }, (error) => {
        this.serviceError = this.serviceErrMsg;
       });
      this.subscriptions$.push(MDMRecipientSubscriptions);
    }
  }

  initiateLink() {
    if (!(this.dataSource && this.dataSource.length === 2) || !(this.dataSource[0].checked || this.dataSource[1].checked)) {
      this.showPrimaryLinkError = true;
      this.showPrimaryUninkError = false;
      return;
    }
    const payload = {
      rqstType: 'link',
      primaryPrsnId: this.dataSource[0].sourceRecipientId,
      secondaryPrsnId: this.dataSource[1].sourceRecipientId,
      prsn1Source: this.dataSource[0].sourceSystemId,
      prsn2Source: this.dataSource[1].sourceSystemId,
      taskId: null
    };
    this.personReconciliationService.initiateLink(payload).subscribe(res => {
      if (res && res.errorCode && res.errorCode[0]){
        this.toastr.error(res.errorCode[0].description);
      } else {
          // res.status = 3;
        this.isServiceSuccess = true;
          this.handleResponse(res);
      }
    }, (error) => {
      this.toastr.error('Internal Server Error');
    });
  }

  hideBanner() {
    this.showMsg = false;
  }

  handleResponse(res) {
    if (res.status === null) {
      this.toastr.error('There was an error in processing your request. Please contact your system administrator');
    }
    if (res.status === 1) {
      this.showMsg = true;
    } else if (res.status === 2) {
      this.reminderModal.nativeElement.click();
      const payload = {
        activeSourceRecipientId: this.dataSource[0].sourceRecipientId,
        dateTimestamp: '2002-05-30T09:00:00',
        inActiveSourceRecipientId: this.dataSource[1].sourceRecipientId,
        messageHeader: {
          dateTimestamp: '2002-05-30T09:00:00',
          originatorId: 'ws-perlss',
          referenceId: 123,
          transactionDate: '2020-09-30T14:22:15.769Z',
          transactionId: 1234
        }
      };
      this.personReconciliationService.mergeRecipient(payload).subscribe(res => {
        if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description) {
          this.toastr.error( res.errorCode[0].description);
        } else {
          const successMsg = res.response.info[0].infoMessage;
          this.toastr.success(successMsg);
        }
      }, (error) => {
        this.toastr.error('Problem with Service!');
      });

    } else if (res.status === 3) {
      const payload = {
          benefitPlanCd: null,
          costNeutralityActionTypeCd: null,
          indvId: this.dataSource[0].sourceRecipientId,
          interfaceNameCd: 'LINK',
          lnkUnlnkId: res.id,
          paeId: null,
          refId: null,
          transitionId: null,
          triggerCd: 'LNK1',
          triggerSourceCd: 'TEDS'
      };
      this.personReconciliationService.triggerLinkUnlink(payload).subscribe(res => {
        if (res && res.code && res.code === 200) {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      }, (error) => {
        this.toastr.error('Internal Server run-time error!');
      });
    }
  }

  initiateUnLink() {
    if (!(this.dataSource && this.dataSource.length === 2) || !(this.dataSource[0].checked || this.dataSource[1].checked)) {
      this.showPrimaryLinkError = false;
      this.showPrimaryUninkError = true;
      return;
    }
    const payload = {
      rqstType: 'unlink',
      primaryPrsnId: this.dataSource[0].sourceRecipientId,
      secondaryPrsnId: this.dataSource[1].sourceRecipientId,
      prsn1Source: this.dataSource[0].sourceSystemId,
      prsn2Source: this.dataSource[1].sourceSystemId,
      taskId: null
    };
    this.personReconciliationService.initiateUnlink(payload).subscribe(res => {
      console.log('initiate unlink res ', res);
      this.isServiceSuccess = true;
      this.handleUnlinkResponse(res);
    }, error => {
    });
  }

  handlePrimaryChange(element) {
    element.checked = true;
    this.showPrimaryLinkError = false;
    this.showPrimaryUninkError = false;
  }

  handleUnlinkResponse(res) {
    if (res.status === 2) {
      const payload = {
        dateTimestamp: '2002-05-30T09:00:00',
        inActiveSourceRecipientId: this.dataSource[0].sourceRecipientId,
        messageHeader: {
          dateTimestamp: '2002-05-30T09:00:00',
          originatorId: 'ws-teds',
          referenceId: 123,
          transactionDate: '2020-09-30T14:22:15.769Z',
          transactionId: 1234
        }
      };
      this.personReconciliationService.unMergeRecipient(payload).subscribe(res => {
        if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description) {
          this.toastr.error( res.errorCode[0].description);
        } else {
          const successMsg = res.response.info[0].infoMessage;
          this.toastr.success(successMsg);
          this.reminderModal.nativeElement.click();
        }
      }, (error) => {
      });

      const triggerPayload = {
        benefitPlanCd: null,
        costNeutralityActionTypeCd: null,
        indvId: this.dataSource[0].sourceRecipientId,
        interfaceNameCd: 'LINK',
        lnkUnlnkId: res.id,
        paeId: null,
        refId: null,
        transitionId: null,
        triggerCd: 'LNK1',
        triggerSourceCd: 'TEDS'
    };
      this.personReconciliationService.triggerLinkUnlink(triggerPayload).subscribe(res => {
      if (res && res.code && res.code === 200) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    }, (error) => {
      this.toastr.error('Internal Server run-time error!');
    });

    } else if (res.status === 3) {
      const payload = {
        dateTimestamp: '2002-05-30T09:00:00',
        inActiveSourceRecipientId: this.dataSource[0].sourceRecipientId,
        messageHeader: {
          dateTimestamp: '2002-05-30T09:00:00',
          originatorId: 'ws-teds',
          referenceId: 123,
          transactionDate: '2020-09-30T14:22:15.769Z',
          transactionId: 1234
        }
      };
      this.personReconciliationService.unMergeRecipient(payload).subscribe(res => {
        if (res && res.errorCode && res.errorCode.length > 0 && res.errorCode[0].description) {
          this.toastr.error( res.errorCode[0].description);
        } else {
          const successMsg = res.response.info[0].infoMessage;
          this.toastr.success(successMsg);
          this.reminderModal.nativeElement.click();
        }
      }, (error) => {
      });
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
    sessionStorage.removeItem('ACTIVE_SESSION_DATA');
  }

  close() {
    this.reminderModal.nativeElement.click();
  }

}
