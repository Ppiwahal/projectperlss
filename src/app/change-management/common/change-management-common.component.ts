import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { fromEvent } from 'rxjs';
import * as customValidation from '../../_shared/constants/validation.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Applicant } from '../../_shared/model/Applicant';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-change-management-common',
  templateUrl: './change-management-common.component.html',
  styleUrls: ['./change-management-common.component.scss']
})
export class ChangeManagementCommonComponent implements OnInit, OnDestroy {
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  @Output() redirect: EventEmitter<any> = new EventEmitter();
  noticeCreateForm: FormGroup;
  personId: string;
  prsnDetail: any;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  entityId = JSON.parse(this.localStorageLocal).entityId;
  displayPaeOverrideOption = false;
  gender: any;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];
  inboxPersonId: any;
  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
      const searchParamsBySession = sessionStorage.getItem('ACTIVE_SESSION_DATA');
      if (searchParamsBySession) {
        const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParamsBySession, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
        const searchParamJson = JSON.parse(deCryptedSearchParams);
        this.inboxPersonId = searchParamJson.personId;
      }
    }

  twoPanelMode: false;
  @Input() mode = 'default';
  subscribed: Array<Subscription> = [];
  myForm: FormGroup;
  customValidation = customValidation;
  demoForm: FormGroup;
  showNoMatch = false;
  buttonName: string;
  selectedSecondaryMatch = '-1';
  showSecondaryMatch = false;
  showSearchMatch = false;
  searchMatches: Array<any> = null;
  secondaryMatches: Array<any> = null;
  searchPanelName: string;
  resultPanelName: string;
  tableSettings: Array<any> = [];
  searchTableKeys: Array<string> = ['paeId', 'paeStatus', 'enrollGroup', 'enrollStatus', 'loc', 'dueDate'];
  maxResults = 20;
  moreResults: string = null;
  hasSearchMatches = false;
  hasSecondaryMatches = false;
  selectedSearchIndex = '-1';
  panelOpen = false;
  personData: any;
  subscriptions$: any[] = [];
  personOptions: any[] = [];
  selectedPersonId: any;
  selectedName: any;
  searchDetails: any;
  prsnId: string;
  minDate: Date;
  maxDate: Date;
  paeId: any;
  additionalInfo;
  genderCd = [
    { code: 'M', value: 'Male', activateSW: 'Y' },
    { code: 'F', value: 'Female', activateSW: 'Y' },
    { code: 'U', value: 'Unknown', activateSW: 'Y' },
  ];
  modeData = {
    default: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'levelOfCare' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0THIS\u00a0PAE',
      resultPanelName: 'Details',
      searchPanelName: 'Select PAE',
      twoPanelMode: false
    },
    demographics: {
      tableSettings: [
        { title: 'Record Id', field: 'paeId' },
        { title: 'Status', field: 'statusCd', lookup: ['paeStatus', 'value'] },
        { title: 'Program', field: 'programCd', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Last Update Date', field: 'lastModifiedDt', format: 'date' }
      ],
      tableSettings2: [
        { title: 'Record Id', field: 'refId' },
        { title: 'Status', field: 'refStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Program', field: 'programCd', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Last Update Date', field: 'lastModifiedDt', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0RECORD',
      resultPanelName: 'Demographic Information',
      searchPanelName: 'Record',
      twoPanelMode: false
    },
    demograph: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'levelOfCare' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0RECORD',
      resultPanelName: 'Review and submit',
      searchPanelName: 'Demographic Information',
      twoPanelMode: false
    },
    revisePae: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'locDcsnCd' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0THIS\u00a0PAE',
      resultPanelName: 'Details',
      searchPanelName: 'Select PAE',
      twoPanelMode: false
    },
    addServiceDate: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'locDcsnCd' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0THIS\u00a0PAE',
      resultPanelName: 'Details',
      searchPanelName: 'Select PAE',
      twoPanelMode: false
    },
    addServiceDischarge: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'locDcsnCd' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0THIS\u00a0PAE',
      resultPanelName: 'Details',
      searchPanelName: 'Select PAE',
      twoPanelMode: false
    },
    referral: {
      tableSettings: [
        { title: 'Referral ID', field: 'refId' },
        { title: 'Program', field: 'programCd', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Referral Submission Date', field: 'submissionDt', format: 'date' },
        { title: 'Last Update Date', field: 'lastModifiedDt' },
        { title: 'Referral status', field: 'refStatus', lookup: ['referralStatus', 'value'] },
      ],
      buttonName: 'SELECT REFERRAL',
      resultPanelName: 'Details',
      searchPanelName: 'Select Referral',
      twoPanelMode: false
    },
    facility: {
      tableSettings: [
        { title: 'PAE ID', field: 'paeId' },
        { title: 'PAE Status', field: 'paeStatus', lookup: ['paeStatus', 'value'] },
        { title: 'Enrollment Group', field: 'enrollmentGroup', lookup: ['enrollmentGroup', 'value'] },
        { title: 'Enrollment Status', field: 'enrollmentStatus', lookup: ['enrollmentStatus', 'value'] },
        { title: 'Level of Care', field: 'levelOfCare' },
        { title: 'Reassessment Due\u00a0Date', field: 'reassessmentDueDate', format: 'date' }
      ],
      buttonName: 'SELECT\u00a0THIS\u00a0PAE',
      resultPanelName: 'Details',
      searchPanelName: 'Select PAE',
      twoPanelMode: false
    },
    twoPanel: {
      tableSettings: null,
      buttonName: null,
      resultPanelName: 'Details',
      searchPanelName: null,
      twoPanelMode: true
    }
  };


  ngOnInit(): void {
    this.getAllPersonDetails();
    this.noticeCreateForm = this.formBuilder.group({
      personSearchInput: ['', Validators.required],
    });
    this.demoForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          this.customValidator.nameValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          this.customValidator.nameValidator(),
        ],
      ],
      midInitial: [''],
      suffix: [''],
      dateOfBirth: ['', [Validators.required]],
      genderCd: [''],
      ssn: ['', [Validators.required, this.customValidator.ssnValidator()]],
      aliasFirstName: [''],
      aliasLastName: [''],
      aliasMidInitial: [
        '',
        [Validators.maxLength(1), Validators.pattern('^[a-zA-Z]*$')],
      ],
      aliasSuffix: ['']
    });

    const that = this;

    const mode = this.modeData[this.mode];

    this.tableSettings = mode.tableSettings;
    this.buttonName = mode.buttonName;
    this.searchPanelName = mode.searchPanelName;
    this.resultPanelName = mode.resultPanelName;
    this.twoPanelMode = mode.twoPanelMode;
    if(this.inboxPersonId) {
      this.noticeCreateForm.controls.personSearchInput.setValue(this.inboxPersonId);
      const personDetailsOnInit$ = this.changeManagementService.getPersonDetails(this.inboxPersonId, this.entityId).subscribe((res) => {
        this.handlePersonDetails(res);
        document.getElementById('personIdElement').focus();
      }, (err) => {
        console.log('error', err);
      });
      this.subscriptions$.push(personDetailsOnInit$);
    }

  }

  getData() {
    return this.noticeCreateForm.controls;
  }

  showSecondaryMatches() {
    this.showSecondaryMatch = true;
  }
  getFormData() {
    return this.demoForm.controls;
  }

  showSearchMatches() {
    this.showSearchMatch = true;
  }

  selectPerson() {
    const that = this;
    if (this.twoPanelMode) {
      this.getEntityAssociation();
      this.panelOpen = true;
      this.changeManagementService.sendPersonData(this.prsnDetail);
    }
    else {
      if (this.mode === 'referral') {
        console.log("this.mode", this.mode);
        const referralSubscriptions$ = this.changeManagementService.getReferralDetails(this.selectedPersonId).then(response => {
          const result = [];
          if ((response.body as unknown as Array<string>).length > 0) {
            response.body.forEach(dataItem => {
              const dataRow = [];
              that.tableSettings.forEach(config => {
                dataRow.push(that.changeManagementService.lookupField(config, dataItem));
              });
              result.push(dataRow);
            });
            that.secondaryMatches = result;
            that.hasSecondaryMatches = true;
            this.personData = response.body;
          } else {
            that.hasSecondaryMatches = false;
            that.showNoMatch = true;
          }
          const referralDetails = { personId: this.selectedPersonId, refId: response.body[0].refId, refStatus: response.body[0].refStatus }
          this.changeManagementService.sendPersonData(referralDetails);
        });
        this.subscriptions$.push(referralSubscriptions$);

      } else {
        if (this.twoPanelMode && this.mode === 'twoPanel') {
          this.getEntityAssociation();
        }

        else {
          if (this.mode === 'demographics') {
            this.updateDemographics();
          }else if(this.mode === 'revisePae' ) {
            const paeSubscriptions$ = this.changeManagementService.getRevisePaeSearchResults(this.selectedPersonId).then(response => {
              const result = [];
              if ((response.body as unknown as Array<string>).length > 0) {
                response.body.forEach(dataItem => {
                  const dataRow = [];
                  that.tableSettings.forEach(config => {
                    dataRow.push(that.changeManagementService.lookupField(config, dataItem));
                  });
                  result.push(dataRow);
                });
                that.secondaryMatches = result;
                console.log('secondaryMatches', that.secondaryMatches);
                that.hasSecondaryMatches = true;
                this.personData = response.body;
                that.showNoMatch = false;
              } else {
                that.hasSecondaryMatches = false;
                that.showNoMatch = true;
              }
            });
          } else if(this.mode === 'addServiceDate' ) {
            const paeSubscriptions$ = this.changeManagementService.getAddServicedatePaeSearchResults(this.selectedPersonId).then(response => {
              const result = [];
              if ((response.body as unknown as Array<string>).length > 0) {
                response.body.forEach(dataItem => {
                  const dataRow = [];
                  that.tableSettings.forEach(config => {
                    dataRow.push(that.changeManagementService.lookupField(config, dataItem));
                  });
                  result.push(dataRow);
                });
                that.secondaryMatches = result;
                console.log('secondaryMatches', that.secondaryMatches);
                that.hasSecondaryMatches = true;
                this.personData = response.body;
                that.showNoMatch = false;
              } else {
                that.hasSecondaryMatches = false;
                that.showNoMatch = true;
              }
            });
          }else if (this.mode === 'addServiceDischarge' ) {
            this.subscription2$ = this.changeManagementService.getaddServiceDischargeTransition(this.selectedPersonId).subscribe(response => {
              console.log("response", response);
              const result = [];
              if ((response as unknown as Array<string>).length > 0) {
                response.forEach(dataItem => {
                  const dataRow = [];
                  that.tableSettings.forEach(config => {
                    dataRow.push(that.changeManagementService.lookupField(config, dataItem));
                  });
                  result.push(dataRow);
                });
                that.secondaryMatches = result;
                console.log('secondaryMatches', that.secondaryMatches);
                that.hasSecondaryMatches = true;
                this.personData = response;
                console.log("this.personData", this.personData)
                that.showNoMatch = false;
              } else {
                that.hasSecondaryMatches = false;
                that.showNoMatch = true;
              }
            });
            this.subscriptions$.push(this.subscription2$);
          }
          else {
            const paeSubscriptions$ = this.changeManagementService.getPaeSearchResults(this.selectedPersonId).then(response => {
              if (this.mode === 'facility') {
                this.paeId = response.body[0].paeId;
              }
              const result = [];
              if ((response.body as unknown as Array<string>).length > 0) {
                response.body.forEach(dataItem => {
                  const dataRow = [];
                  that.tableSettings.forEach(config => {
                    dataRow.push(that.changeManagementService.lookupField(config, dataItem));
                  });
                  result.push(dataRow);
                });
                that.secondaryMatches = result;
                console.log('secondaryMatches', that.secondaryMatches);
                that.hasSecondaryMatches = true;
                this.personData = response.body;
                that.showNoMatch = false;
              } else {
                that.hasSecondaryMatches = false;
                that.showNoMatch = true;
              }
            });
            this.subscriptions$.push(paeSubscriptions$);

            // if(this.mode === 'facility'){
            //   this.getChmFaciltyTransfer();
            // }
          }
        }
      }
    }

  }

  write(value) {
    return JSON.stringify(value, null, '  ');
  }

  lookupField(fieldSetting: any, datarow: any): string {

    if (datarow.hasOwnProperty(fieldSetting.field)) {
      const value = datarow[fieldSetting.field];
      if (fieldSetting.lookup) {
        return this.changeManagementService.getLookupValue(fieldSetting.lookup, value);
      } else {
        return this.changeManagementService.addDashes(value);
      }
    } else {
      return '<not found: ' + fieldSetting.field + '>';
    }
  }

  select(event: Event) {
    const clicked = event.currentTarget as HTMLButtonElement;
    const rowIndex = clicked.getAttribute('rowIndex');
    if (rowIndex == this.selectedSecondaryMatch) {
      this.panelOpen = false;
      this.selectedSecondaryMatch = '-1';
    } else {
      this.panelOpen = true;
      this.selectedSecondaryMatch = rowIndex;
      const personData = { additionalinfo: this.additionalInfo, personId: this.selectedPersonId, name: this.selectedName, ...this.personData[rowIndex] }
      this.changeManagementService.sendPersonData(personData);
    }
    if (this.mode === 'facility') {
      this.getChmFaciltyTransfer();
    }
    this.panelOpen = true;
  }

  getPersonRecordResults(option) {
    const personRecordSubscriptions$ = this.changeManagementService.getPersonRecordResults(option.prsnDetail.prsnId).subscribe((res) => {
    });
    this.subscriptions$.push(personRecordSubscriptions$);

  }


  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      const personDetails$ = this.changeManagementService.getPersonDetails(text, this.entityId).subscribe((res) => {
        this.handlePersonDetails(res);
      }, (err) => {
        console.log('error', err);
      });
      this.subscriptions$.push(personDetails$);
    });
  }

  handlePersonDetails(res) {
    console.log('res ', res);
    this.personOptions = [];
    if (res && res.length > 0) {
      res.forEach(personDetail => {
        this.personOptions.push({
          personId: personDetail.prsnId,
          prsnDetail: personDetail
        });
      });
    } else {

    }

  }

  handleSelection(option) {
    const personDisplayName = 'Applicant Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + option.prsnDetail.dobDt + ', SSN: ' + option.prsnDetail.ssn + ', Person ID: ' + option.prsnDetail.prsnId + ', County: ' + option.prsnDetail.cntyCd;
    this.noticeCreateForm.controls.personSearchInput.setValue(personDisplayName);
    this.selectedPersonId = option.prsnDetail.prsnId;
    this.selectedName = { firstname: option.prsnDetail.firstName, lastName: option.prsnDetail.lastName };
    if (this.mode === 'demograph') {
      this.updateDemograph(option);
    }
    if (this.mode === 'demographics') {
      this.getPersonRecordResults(option);
    }

  }
  updateDemographics() {
    const updateAddressRecordSubscriptions$ = this.changeManagementService.getCmUpdateAddressRecord(this.selectedPersonId).subscribe((res) => {
      var designeeInfo;
      if (res.refRequestVOs && res.refRequestVOs.length > 0 && res.refRequestVOs[0].refAppAddrDtlVOs && res.refRequestVOs[0].refAppAddrDtlVOs.length > 0) {
        designeeInfo = res.refRequestVOs[0].refAppAddrDtlVOs;
      }
      var designeeName;
      if (res.refRequestVOs && res.refRequestVOs.length > 0 && res.refRequestVOs[0].refAppCnctVOs && res.refRequestVOs[0].refAppCnctVOs.length > 0) {
        designeeName = res.refRequestVOs[0].refAppCnctVOs;
      }
      var paeInfo;
      if (res.paeRqstVOs && res.paeRqstVOs.length > 0 && res.paeRqstVOs[0].paeAppAddrDtlVOs && res.paeRqstVOs[0].paeAppAddrDtlVOs.length > 0) {
        paeInfo = res.paeRqstVOs[0].paeAppAddrDtlVOs;
      }
      this.additionalInfo = { applicantInfo: res.comApplcntAddrVOs, designeInfo: designeeInfo, paeData: paeInfo, designeName: designeeName };

      var response = [];
      res.paeRqstVOs.forEach(element => {
        const dataRow = [];
        this.tableSettings.forEach(config => {
          dataRow.push(this.changeManagementService.lookupField(config, element));
        });
        response.push(dataRow);
      });
      const mode = this.modeData[this.mode];

      this.tableSettings = mode.tableSettings2;
      res.refRequestVOs.forEach(element => {
        const dataRow = [];
        this.tableSettings.forEach(config => {
          dataRow.push(this.changeManagementService.lookupField(config, element));
        });
        response.push(dataRow);
      });
      this.personData = response;
      this.secondaryMatches = response;
      this.hasSecondaryMatches = true;
    });
    this.subscriptions$.push(updateAddressRecordSubscriptions$);

  }
  getEntityAssociation() {
    const entityAssociationSubscriptions$ = this.changeManagementService.getEntityAssociation(this.selectedPersonId).subscribe((res) => {
      const entityAssociation = { personId: this.selectedPersonId, entity: res }
      this.changeManagementService.sendPersonData(entityAssociation);
    });
    this.subscriptions$.push(entityAssociationSubscriptions$);

  }
  getChmFaciltyTransfer() {
    const paeLivingArrangementSubscriptions$ = this.changeManagementService.getPaeLivingArrangement(this.paeId).subscribe((res) => {
      const facilityTransfer = { personId: this.selectedPersonId, data: res }
      this.changeManagementService.sendPersonData(facilityTransfer);
    });
    this.subscriptions$.push(paeLivingArrangementSubscriptions$);


  }
  updateDemograph(option) {
    const userDetailsSubscriptions$ = this.changeManagementService.getUserDetails(option.prsnDetail.prsnId, '', '').subscribe((res) => {
      this.demoForm.controls['genderCd'].setValue(res.genderCd);
      this.demoForm.controls['firstName'].setValue(res.firstName);
      this.demoForm.controls['lastName'].setValue(res.lastName);
      this.demoForm.controls['dateOfBirth'].setValue(new Date(res.dobDt));
      this.demoForm.controls['ssn'].setValue(res.ssn);
      this.demoForm.controls['suffix'].setValue(res.suffix);
      this.demoForm.controls['midInitial'].setValue(res.midInitial);
      this.demoForm.controls['aliasFirstName'].setValue(res.aliasFirstName);
      this.demoForm.controls['aliasMidInitial'].setValue(res.aliasMidInitial);
      this.demoForm.controls['aliasLastName'].setValue(res.aliasLastName);
      this.demoForm.controls['aliasSuffix'].setValue(res.aliasSuffix);
    });
    this.subscriptions$.push(userDetailsSubscriptions$);


  }

  get f() {
    return this.noticeCreateForm.controls;
  }
  searchForPerson() {
    console.log(this.demoForm);
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    const entityId = JSON.parse(localStorageLocal).entityId;
    const entityTypeCd = JSON.parse(localStorageLocal).entityTypeCd;
    const searchApplicant = new Applicant(
      null,
      this.selectedPersonId,
      this.demoForm.controls['aliasFirstName'].value,
      this.demoForm.controls['aliasLastName'].value,
      this.demoForm.controls['aliasMidInitial'].value,
      this.demoForm.controls['aliasSuffix'].value,
      'NO',
      this.demoForm.controls['dateOfBirth'].value,
      this.demoForm.controls['firstName'].value,
      this.demoForm.controls['genderCd'].value,
      this.demoForm.controls['lastName'].value,
      this.demoForm.controls['midInitial'].value,
      this.demoForm.controls['ssn'].value,
      'NO',
      this.demoForm.controls['suffix'].value,
      true,
      'PERAI',
      null,
      'NO',
      entityId,
      entityTypeCd,
      null
    );
    const searchPersonSubscriptions$ = this.changeManagementService.postSearchPerson(searchApplicant).subscribe((res) => {
      const demographicPersonDetails = { ...this.demoForm.value, personId: this.selectedPersonId, postSearchPersonId: res[0].enableChmSubmit }
      this.changeManagementService.sendPersonData(demographicPersonDetails);
      this.demoForm.markAsPristine();
      this.panelOpen = true;
    });
    this.subscriptions$.push(searchPersonSubscriptions$);

  }

  displayPae(element): void {
    if (element[1] === 'Withdrawn' || element[1] === 'Inactive') {
      this.displayPaeOverrideOption = true;
      this.changeManagementService.displayPae$$.next(this.displayPaeOverrideOption);
    }
  }
  ngOnDestroy() {
    this.subscribed.forEach(subscription$ => subscription$.unsubscribe());
  }

}
