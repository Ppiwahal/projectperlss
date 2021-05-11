import { Component, ViewEncapsulation, OnInit, OnDestroy, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { AddressService } from '../../_shared/services/address.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { UpdateAddress } from 'src/app/_shared/model/change-management/addressFile';
import { cmUpdateAddressOnFile } from 'src/app/_shared/model/change-management/cmUpdateAddressOnFile';
import { ToastrService } from 'ngx-toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AddressValidationComponent } from '../../_shared/components/address-validation/address-validation.component';
import { MatSelectChange } from '@angular/material/select';
import { CmUpdateAddressOnFileVO } from 'src/app/_shared/model/change-management/CmUpdateAddressOnFileVO';
@Component({
  selector: 'app-cm-update-address-on-file',
  templateUrl: './cm-update-address-on-file.component.html',
  styleUrls: ['./cm-update-address-on-file.component.scss'],
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
export class CmUpdateAddressOnFileComponent implements OnInit, OnDestroy {

  customValidation = customValidation;
  submitted: boolean = false;
  myFormA: FormGroup;
  myFormB: FormGroup;
  subscribed: Array<Subscription> = [];
  personData: any;
  program: string;
  panelA: boolean = false;
  panelB: boolean = false;
  entityData: Array<any> = [];
  @Input() hideValidation = false;
  addressFormat: any[] = [];
  showMilAddressFormat: boolean;
  showUsFormatFields: boolean = true;
  subscriptions$ = [];
  firstName;
  lastName;
  firstNameDesignee;
  lastNameDesignee;
  militaryPo: any[] = [];
  militaryState: any[] = [];
  stateDropdowns = [];
  countyDropdowns = [];
  showCounty: boolean;
  dependentControls: any = {
    stateCd: [{
      value: ['TN'],
      controls: [{
        name: 'countyCd',
        validators: [Validators.required]
      }]
    }],
  };
  panelOpenA = false;
  panelOpenB = false;
  showDependent: any = { A: {}, B: {} };
  errorText: any = { A: {}, B: {} };
  dataTables: any;
  personName: string;
  @Input() showAddressType: boolean = false;
  @Output() addressFormatChange = new EventEmitter();
  @Input() toggleCounty: boolean = false;
  @ViewChild('accordion', { static: true }) Accordion: MatAccordion;
  mailingAddressSwitch: boolean;
  physicalAddressSwitch: boolean;
  paeId: string;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService,
    private addressService: AddressService,
    private matDialog: MatDialog, private router: Router,
    private toastr: ToastrService
  ) {
    this.dataTables = this.changeManagementService.data;

    let config = {
      adddressTypeCd: [''],
      addressFormat: ['', [Validators.required]],
      addressLine1Txt: ['', [Validators.required]],
      addressLine2Txt: [''],
      cityTxt: ['', [Validators.required]],
      countyCd: ['', [Validators.required]],
      mailAddrSw: ['', [Validators.required]],
      ext: [''],
      stateCd: [''],
      zipCode: ['', [Validators.required]],
      apoFpo: ['', [Validators.required]],
      aaAeAp: ['', [Validators.required]],
      mailingLine1Txt: ['', [Validators.required]],
      mailAddressFormat: ['', [Validators.required]],
      mailingLine2Txt: [''],
      mailCityTxt: ['', [Validators.required]],
      mailZipCode: ['', [Validators.required]],
      mailExt: [''],
      mailCountyCd: ['', [Validators.required]],
      mailStateCd: ['', [Validators.required]],

    };

    this.myFormA = this.fb.group(config);
    this.myFormB = this.fb.group(config);

    this.buildForm('A');
    this.buildForm('B');

  }

  ngOnInit(): void {
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.paeId=this.personData[0];
      })
    );
    const StateDropdownSubscriptions = this.addressService.getDropdownValues('STATE').subscribe(response => {
      this.stateDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(StateDropdownSubscriptions);

    const addressFormat = this.addressService.getDropdownValues('ADDRESS_FORMAT').subscribe(response => {
      this.addressFormat = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(addressFormat);
    console.log(" this.addressFormat", this.addressFormat);
    const militaryPoSubscriptions = this.addressService.getDropdownValues('MILITARY_PO').subscribe(response => {
      this.militaryPo = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(militaryPoSubscriptions);

    const militaryStateSubscription = this.addressService.getDropdownValues('MILITARY_STATE').subscribe(response => {
      this.militaryState = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(militaryStateSubscription);
    const CountyDropdownSubscriptions = this.addressService.getDropdownValues('COUNTY').subscribe(response => {
      this.countyDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(CountyDropdownSubscriptions);
    if (this.showAddressType) {
      this.myFormA.controls.addressFormat.setValue('US');
      this.myFormA.controls['addressFormat'].enable();
    }
  }

  buildForm(formIndex: string) {

    let that = this;
    let currentKey;
    let currentControl;

    // try {
    //   Object.keys(this.dependentControls).forEach(key => {
    //     currentKey = key;
    //     let dependentControl = that.dependentControls[key];
    //     that.subscribed.push(that.getControl(formIndex, key).valueChanges.subscribe(() => {
    //       that.parentClick(formIndex, dependentControl);
    //     }));
    //   });
    // } catch (e) {
    //   console.log('Dependent Controls Error: currentKey = ' + currentKey + '  currentControl = ' + currentControl);
    // }

    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        this.firstName = this.personData.name.firstname;
        this.lastName = this.personData.name.lastName;
        if (this.personData.additionalinfo && this.personData.additionalinfo != null && this.personData.additionalinfo.applicantInfo && this.personData.additionalinfo.applicantInfo.length > 0) {
          this.panelA = true;
          this.setFormA();
          console.log("Forn A set");
        }
        if (this.personData.additionalinfo && this.personData.additionalinfo != null && this.personData.additionalinfo.designeInfo && this.personData.additionalinfo.designeInfo.length > 0 && this.personData.additionalinfo.designeInfo[0].userTypeCd === 'DSGN') {
          this.panelB = true;
          this.setFormB();
          console.log("Forn B set");
        }
        if (this.personData.additionalinfo && this.personData.additionalinfo != null && this.personData.additionalinfo.designeName && this.personData.additionalinfo.designeName.length > 0) {
          this.firstNameDesignee = this.personData.additionalinfo.designeName[0].firstName;
          this.lastNameDesignee = this.personData.additionalinfo.designeName[0].lastName;
        }
        if (this.personData.additionalinfo && this.personData.additionalinfo != null && this.personData.additionalinfo.paeData && this.personData.additionalinfo.paeData.length > 0 && this.personData.additionalinfo.paeData[0].userTypeCd === 'DSGN') {
          this.panelB = true;
          this.setFormC();
          console.log("Forn C set");
        }


        this.fixControls(formIndex);
      })
    );
    this.myFormA.disable();
    this.myFormB.disable();

  }
  setFormC() {
    var paeData = this.personData.additionalinfo.paeData;
    if (paeData) {
      this.myFormB.controls['addressLine1Txt'].setValue(paeData[0].addrLine1);
      this.myFormB.controls['adddressTypeCd'].setValue(paeData[0].addrTypeCd);
      this.myFormB.controls['addressFormat'].setValue(paeData[0].addrFormatCd);
      this.myFormB.controls['addressLine2Txt'].setValue(paeData[0].addrLine2);
      this.myFormB.controls['cityTxt'].setValue(paeData[0].city);
      this.myFormB.controls['stateCd'].setValue(paeData[0].stateCd);
      this.myFormB.controls['zipCode'].setValue(paeData[0].zip);
      this.myFormB.controls['ext'].setValue(paeData[0].zipExtn);
      this.myFormB.controls['countyCd'].setValue(paeData[0].cntyCd);
      this.myFormB.controls['aaAeAp'].setValue(paeData[0].militaryStateCd);
      this.myFormB.controls['apoFpo'].setValue(paeData[0].militaryPoCd);
      this.myFormB.controls['mailAddrSw'].setValue(paeData[0].mailAddrSw);
    }
  }
  setFormB() {
    var designeInfo = this.personData.additionalinfo.designeInfo;
    if (designeInfo) {
      this.myFormB.controls['addressLine1Txt'].setValue(designeInfo[0].addrLine1);
      this.myFormB.controls['adddressTypeCd'].setValue(designeInfo[0].addrTypeCd);
      this.myFormB.controls['addressFormat'].setValue(designeInfo[0].addrFormatCd);
      this.myFormB.controls['addressLine2Txt'].setValue(designeInfo[0].addrLine2);
      this.myFormB.controls['cityTxt'].setValue(designeInfo[0].city);
      this.myFormB.controls['stateCd'].setValue(designeInfo[0].stateCd);
      this.myFormB.controls['zipCode'].setValue(designeInfo[0].zip);
      this.myFormB.controls['ext'].setValue(designeInfo[0].zipExtn);
      this.myFormB.controls['countyCd'].setValue(designeInfo[0].cntyCd);
      this.myFormB.controls['aaAeAp'].setValue(designeInfo[0].militaryStateCd);
      this.myFormB.controls['apoFpo'].setValue(designeInfo[0].militaryPoCd);
      this.myFormB.controls['mailAddrSw'].setValue(designeInfo[0].mailAddrSw);
    }
  }
  setFormA() {

    var applicantInfo = this.personData.additionalinfo.applicantInfo;
    console.log(applicantInfo, "applicantInfo[0].addrTypeCd", applicantInfo[0].addrTypeCd);

   
      this.myFormA.controls['addressLine1Txt'].setValue(applicantInfo[0].addrLine1);
      this.myFormA.controls['adddressTypeCd'].setValue(applicantInfo[0].addrTypeCd);
      this.myFormA.controls['addressFormat'].setValue(applicantInfo[0].addrFormatCd);
      this.myFormA.controls['addressLine2Txt'].setValue(applicantInfo[0].addrLine2);
      this.myFormA.controls['cityTxt'].setValue(applicantInfo[0].city);
      this.myFormA.controls['stateCd'].setValue(applicantInfo[0].stateCd);
      this.myFormA.controls['zipCode'].setValue(applicantInfo[0].zip);
      this.myFormA.controls['ext'].setValue(applicantInfo[0].zipExtn);
      this.myFormA.controls['countyCd'].setValue(applicantInfo[0].cntyCd);
      this.physicalAddressSwitch = true;
      this.mailingAddressSwitch = false;
 if(applicantInfo[0].mailAddrLine1!=null){
    this.myFormA.controls['mailingLine1Txt'].setValue(applicantInfo[0].mailAddrLine1);
    this.myFormA.controls['adddressTypeCd'].setValue(applicantInfo[0].addrTypeCd);
    this.myFormA.controls['mailAddressFormat'].setValue(applicantInfo[0].mailAddressFormatCd);
    this.myFormA.controls['mailingLine2Txt'].setValue(applicantInfo[0].mailAddrLine2);
    this.myFormA.controls['mailCityTxt'].setValue(applicantInfo[0].mailCity);
    this.myFormA.controls['mailStateCd'].setValue(applicantInfo[0].mailState);
    this.myFormA.controls['mailZipCode'].setValue(applicantInfo[0].mailZip);
    this.myFormA.controls['mailExt'].setValue(applicantInfo[0].mailZipExtn);
    this.myFormA.controls['mailCountyCd'].setValue(applicantInfo[0].mailCounty);
    this.physicalAddressSwitch = false;
    this.mailingAddressSwitch = true;
 }

 if (applicantInfo[0].mailAddrSw === 'Y'){
  this.myFormA.controls['adddressTypeCd'].disable();
}
    this.myFormA.controls['aaAeAp'].setValue(applicantInfo[0].militaryStateCd);
    this.myFormA.controls['apoFpo'].setValue(applicantInfo[0].militaryPoCd);
    this.myFormA.controls['mailAddrSw'].setValue(applicantInfo[0].mailAddrSw);
    
    

  }

  getFormData() {
    return this.myFormA.controls;
  }

  selectTargetPopulation(matSelectChange: MatSelectChange) {
    console.log('value=====', matSelectChange.value);
    if (matSelectChange.value === 'MAI') {
      this.mailingAddressSwitch = true;
      this.physicalAddressSwitch = false;
    } else  if (matSelectChange.value === 'PHY'){
      this.mailingAddressSwitch = false;
      this.physicalAddressSwitch = true;
      
    }

  }

  getControl(formIndex: string, name: string) {
    return (formIndex == "A" ? this.myFormA : this.myFormB).controls[name];
  }

  openPanel(id) {
    switch (id) {
      case 'A':
        this.panelOpenA = this.panelOpenA;
        if (this.panelOpenA) { this.panelOpenB = false; }
        break;

      case 'B':
        this.panelOpenB = !this.panelOpenB;
        if (this.panelOpenB) { this.panelOpenA = false; }
        break;
    }
  }

  validate(formIndex) {

  }

  parentClick(formIndex: string, parentControl: string) {
    let config = this.dependentControls[parentControl];
    let value = this.getControl(formIndex, parentControl).value;
    console.log('parentClick .. ' + parentControl + ':' + value);
    let controlName = '';
    try {
      let that = this;
      config.forEach(obj => {

        let match = false;
        obj.values.forEach(val => {
          match = match || (val == value);
        });

        obj.controls.forEach(obj => {
          controlName = obj.name;
          let control = that.getControl(formIndex, controlName);
          if (match) {
            control.setValidators(obj.validators);
            control.markAsPristine();
            control.markAsUntouched();
          } else {
            control.clearValidators();
            control.setValue(null);
          }
        });
        that.showDependent[parentControl] = match;
      })
    } catch (e) {
      console.log('Parent Click error handling control: ' + controlName);
    }
  }

  fixControls(parentIndex: string) {

    let that = this;
    let controls = parentIndex == "A" ? this.myFormA.controls : this.myFormB.controls;

    let timeout = setTimeout(function () {
      Object.keys(controls).forEach(controlName => {
        if (controlName != "search") {
          let control = controls[controlName];
          if (control.errors) {
            let errorKeys = Object.keys(control.errors);
            errorKeys.forEach(key => {
              delete control.errors[key];
            })
          }
          control.setErrors(null);
          control.markAsUntouched();
          that.errorText[controlName] = null;
        }
      });
      clearTimeout(timeout);
    }, 100);
  }

  controlError(formIndex: string, controlName: string): boolean {

    let error = null;
    try {
      const control = formIndex == 'A' ? this.myFormA.controls[controlName] : this.myFormA.controls[controlName];
      if ((this.submitted || control.touched) && control.errors) {
        if (controlName.slice(-4) == "Date" && control.errors.matDatepickerParse?.text !== null && control.status == 'INVALID') {
          error = customValidation.BD;
        } else if (control.errors.dateInFuture) {
          error = customValidation.A5;
        } else if (control.errors.dateInPast) {
          error = customValidation.A15
        } else if (control.errors.required) {
          error = customValidation.A1;
        }
      }
    } catch (e) {
      console.log("bad control name: " + controlName);
    }

    this.errorText[formIndex][controlName] = error;
    return error != null;

  }
  onAddressFormatChanged(code) {
    if (code == 'MA') {
      this.showMilAddressFormat = true;
      this.showUsFormatFields = false;
    } else {
      this.showMilAddressFormat = false;
      this.showUsFormatFields = true;
    }
    this.addressFormatChange.emit(code);
  }
  stateChanged(value) {
    if (value.trim() == 'TN') {
      this.showCounty = true;
    } else {
      this.showCounty = false;
      this.dependentControls = false;
    }
  }
  ngOnChanges(change: SimpleChanges) {
    if (this.toggleCounty) {
      this.stateChanged('TN');
    } else {
      this.stateChanged('');
    }
  }

  executeValidation() {
    if (this.myFormA.status === 'INVALID') {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40vw';
    dialogConfig.height = '29vw';
    dialogConfig.data = {
      addressLine1: this.myFormA.value.addressLine1Txt,
      addressLine2: this.myFormA.value.addressLine2Txt,
      city: this.myFormA.value.cityTxt,
      state: this.myFormA.value.stateCd,
      zipCode: this.myFormA.value.zipCode,
      ext: this.myFormA.value.ext,
      county: this.myFormA.value.countyCd,
      mailAddrSw: this.myFormA.value.mailAddrSw
    };
    const dialogRef = this.matDialog.open(AddressValidationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(address => {
      if (address) {
        this.myFormA.controls.addressLine1Txt.setValue(address.addressLine1);
        this.myFormA.controls.addressLine2Txt.setValue(address.addressLine2);
        this.myFormA.controls.cityTxt.setValue(address.city);
        this.myFormA.controls.state.setValue(address.state);
        this.myFormA.controls.zipCode.setValue(address.zipCode);
        this.myFormA.controls.ext.setValue(address.ext);
        this.myFormA.controls.ext.setValue(address.mailAddrSw);
        console.log(address);
      }
    });
  }

  onSsnAvailableChange(event){
    if (event.checked){
      var applicantInfo = this.personData.additionalinfo.applicantInfo;
      if(applicantInfo[0].mailAddrSw === 'Y'){
        this.myFormA.controls['adddressTypeCd'].disable();
      }
    } else {
      this.myFormA.controls['adddressTypeCd'].enable();
    }
  }

  getFormAData() {
    return this.myFormA.controls;
  }
  getFormBData() {
    return this.myFormB.controls;
  }
  resetForm() {
    this.setFormA();
  }
  resetFormB() {
    this.setFormB();
    this.setFormC();
  }
  onEdit() {
    this.myFormA.enable();
  }
  onEditFormB() {
    this.myFormB.enable();
  }
  sendingYorN(ssnAvailableCheck) {
    if (ssnAvailableCheck) {
      return 'Y';
    } else {
      return 'N';
    }
  }
  onSubmit() {

   
    const UpdateAddressVO = new UpdateAddress(
      this.getFormAData().addressFormat.value,
      this.getFormAData().addressLine1Txt.value,
      this.getFormAData().addressLine2Txt.value,
      this.getFormAData().adddressTypeCd.value,
      this.getFormAData().cityTxt.value,
      this.getFormAData().countyCd.value,
      0,
      this.getFormAData().mailingLine1Txt.value,
      this.getFormAData().mailingLine2Txt.value,
      this.sendingYorN(this.getFormAData().mailAddrSw.value),
      this.getFormAData().mailAddressFormat.value,
      this.getFormAData().mailCityTxt.value,
      this.getFormAData().mailCountyCd.value,
      this.getFormAData().aaAeAp.value,
      this.getFormAData().apoFpo.value,
      this.getFormAData().mailStateCd.value,
      null,
      this.getFormAData().mailZipCode.value,
      this.getFormAData().mailExt.value,
      this.getFormAData().aaAeAp.value,
      this.getFormAData().apoFpo.value,
	  this.personData.personId,
      'PERAI',
      this.getFormAData().stateCd.value,
      null,
      this.getFormAData().zipCode.value,
      this.getFormAData().ext.value,
      this.paeId
    );
    
    const CmUpdateAddressOnFileVOObj=new CmUpdateAddressOnFileVO(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'APPL',
      null,
      null,
      null,
      null,
      UpdateAddressVO
    );
    
      let cmUpdateAddressOnFileVOList = [];
    
      cmUpdateAddressOnFileVOList.push(
        CmUpdateAddressOnFileVOObj
        );
     
console.log("CmUpdateAddressOnFileVOObjList::::::::::"+cmUpdateAddressOnFileVOList);
    let CmUpdateAddressOnFileObj=new cmUpdateAddressOnFile(
      this.paeId,
      this.personData.personId,
      cmUpdateAddressOnFileVOList


    );
    CmUpdateAddressOnFileObj.cmUpdateAddressOnFileVOList=cmUpdateAddressOnFileVOList
    console.log(UpdateAddressVO);
    const updateAddressSubscriptions = this.changeManagementService.updateAddressOnFile(CmUpdateAddressOnFileObj).subscribe(res => {
      if (res.errorCode) {
        this.toastr.error(res.errorCode[0].description);
      } else {
        this.router.navigate(['ltss/changeManagement/dashboard']);
      }
    });
    this.subscriptions$.push(updateAddressSubscriptions);

  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}








