import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-appeal-representative-details',
  templateUrl: './appeal-representative-details.component.html',
  styleUrls: ['./appeal-representative-details.component.scss']
})
export class AppealRepresentativeDetailsComponent implements OnInit {

  addRepresentativeForm: FormGroup;
  yesOrNo :any[] = [{"code": "Y", "value":"Yes"},{"code": "N", "value":"No"}]
  showProHealthInfo: boolean;
  @Output() saveRepresentaviveData: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() representativeData: any;
  @Input() nameSuffix: any;
  @Input() relationshipToAppellant: any ;
  @Input() verificationSource: any;
  @Input() phoneType: any;
  mailingAddress: any;
  showMailingAddress: boolean;
  showVerficationDetails: boolean;
  showOtherVeriSourcDetails: boolean;
  customValidation = customValidation;
  submitted: boolean;
  maxDate: Date = new Date();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setFormData();
  }

  ngOnChanges(){
    this.initializeForm();
    this.setFormData();
    console.log(this.nameSuffix)
  }

  addRepresentativeData(formData){
  this.submitted = true;
    if(formData.valid){
      this.saveRepresentaviveData.emit(formData.value);
    }
  }

  cancel(){
    this.cancelEmit.emit();
  }

  initializeForm(){
    this.addRepresentativeForm = this.formBuilder.group({
      firstName:['', Validators.required],
      mi: [''],
      lastName: ['', Validators.required],
      suffix:[''],
      appellantRelationship:['', Validators.required],
      organizationName:[''],
      cellPhone:[''],
      homePhone:[''],
      workPhone: [''],
      phoneType:['', Validators.required],
      emailAddress:[''],
      authoriedRepresentative:['', Validators.required],
      healthPermission:[{ disabled: true, value: '' },Validators.required],
      verificationSource:[{ disabled: true, value: '' },Validators.required],
      otherVerificationDetails:[{ disabled: true, value: '' },Validators.required],
      dateVerified:[{ disabled: true, value: '' },Validators.required],
      verificationEndDate:[{ disabled: true, value: '' },Validators.required],
      isMailingAddressSame:['', Validators.required],
      mailingAddress: this.formBuilder.group({
        addressFormat: [''],
        addrLine1: [''],
        addrLine2: [''],
        city:[''],
        state: [''],
        zipCode: [''],
        ext: [''],
        county: [''],
        apoFpo: [''],
        aaAeAp: ['']
      })
    });
    this.mailingAddress = this.addRepresentativeForm.controls['mailingAddress']
   
  }
  
  f(){
    return this.addRepresentativeForm.controls;
  }

  setFormData(){
    if(this.representativeData !== undefined){
      // this.addRepresentativeForm.patchValue({
      //   firstName:this.representativeData.firstName
      // })
      this.authorizedRepresentativeSelected(this.representativeData.authoriedRepresentative);
      this.addRepresentativeForm.controls['firstName'].setValue(this.representativeData.firstName);
      this.addRepresentativeForm.controls['mi'].setValue(this.representativeData.mi);
      this.addRepresentativeForm.controls['lastName'].setValue(this.representativeData.lastName);
      this.addRepresentativeForm.controls['suffix'].setValue(this.representativeData.suffix);
      this.addRepresentativeForm.controls['appellantRelationship'].setValue(this.representativeData.appellantRelationship);
      this.addRepresentativeForm.controls['organizationName'].setValue(this.representativeData.organizationName);
      this.addRepresentativeForm.controls['workPhone'].setValue(this.representativeData.workPhone);
      this.addRepresentativeForm.controls['cellPhone'].setValue(this.representativeData.workPhone);
      this.addRepresentativeForm.controls['homePhone'].setValue(this.representativeData.homePhone);
      this.addRepresentativeForm.controls['phoneType'].setValue(this.representativeData.phoneType);
      this.addRepresentativeForm.controls['emailAddress'].setValue(this.representativeData.emailAddress);
      this.addRepresentativeForm.controls['authoriedRepresentative'].setValue(this.representativeData.authoriedRepresentative);
      this.addRepresentativeForm.controls['healthPermission'].setValue(this.representativeData.healthPermission);
      this.addRepresentativeForm.controls['verificationSource'].setValue(this.representativeData.verificationSource);
      this.addRepresentativeForm.controls['otherVerificationDetails'].setValue(this.representativeData.otherVerificationDetails);
      this.addRepresentativeForm.controls['dateVerified'].setValue(this.representativeData.dateVerified);
      this.addRepresentativeForm.controls['verificationEndDate'].setValue(this.representativeData.verificationEndDate);
      this.addRepresentativeForm.controls['isMailingAddressSame'].setValue(this.representativeData.isMailingAddressSame);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['addressFormat'].setValue(this.representativeData.mailingAddress.addressFormat);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['addrLine1'].setValue(this.representativeData.mailingAddress.addressFormat);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['addrLine2'].setValue(this.representativeData.mailingAddress.addressFormat);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['city'].setValue(this.representativeData.mailingAddress.city);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['state'].setValue(this.representativeData.mailingAddress.state);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['zipCode'].setValue(this.representativeData.mailingAddress.zipCode);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['ext'].setValue(this.representativeData.mailingAddress.ext);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['county'].setValue(this.representativeData.mailingAddress.county);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['apoFpo'].setValue(this.representativeData.mailingAddress.apoFpo);
      this.addRepresentativeForm.controls['mailingAddress']['controls']['aaAeAp'].setValue(this.representativeData.mailingAddress.aaAeAp);
      this.addressTypeChanged(this.representativeData.isMailingAddressSame);
      this.permiReleProHealInfoChange(this.representativeData.healthPermission);
      this.verificationSourChange(this.representativeData.otherVerificationDetails);
    }
  }

  authorizedRepresentativeSelected(value){
    if(value == 'N'){
      this.showProHealthInfo = true
      this.showVerficationDetails = false;
      this.addRepresentativeForm.controls['healthPermission'].setValue('');
      this.addRepresentativeForm.controls['healthPermission'].enable();
      this.addRepresentativeForm.controls['verificationSource'].disable();
      this.addRepresentativeForm.controls['dateVerified'].disable();
      this.addRepresentativeForm.controls['verificationEndDate'].disable();
    } else {
      this.showVerficationDetails = true;
      this.addRepresentativeForm.controls['verificationSource'].enable();
      this.addRepresentativeForm.controls['dateVerified'].enable();
      this.addRepresentativeForm.controls['verificationEndDate'].enable();
      this.showProHealthInfo = false;
      this.addRepresentativeForm.controls['healthPermission'].disable();
    }
  }

  permiReleProHealInfoChange(value){
    if(value == 'Y'){
      this.addRepresentativeForm.controls['verificationSource'].enable();
      this.addRepresentativeForm.controls['dateVerified'].enable();
      this.addRepresentativeForm.controls['verificationEndDate'].enable();
      this.showVerficationDetails = true;
    } else {
      this.showVerficationDetails = false;
      this.addRepresentativeForm.controls['verificationSource'].disable();
      this.addRepresentativeForm.controls['dateVerified'].disable();
      this.addRepresentativeForm.controls['verificationEndDate'].disable();
    }
  }

  verificationSourChange(value){
    if(value == 'OT'){
      this.addRepresentativeForm.controls['otherVerificationDetails'].enable();
      this.showOtherVeriSourcDetails = true;
    } else {
      this.addRepresentativeForm.controls['otherVerificationDetails'].disable();
      this.showOtherVeriSourcDetails = false;
    }
  }


  addressTypeChanged(value){
    if(value == 'N'){
      this.showMailingAddress = true;
      this.mailingAddress.controls['addressFormat'].setValidators(Validators.required);
      this.mailingAddress.controls['addrLine1'].setValidators(Validators.required);
      this.mailingAddress.controls['city'].setValidators(Validators.required);
      this.mailingAddress.controls['state'].setValidators(Validators.required);
      this.mailingAddress.controls['zipCode'].setValidators(Validators.required);
      this.mailingAddress.controls['addressFormat'].updateValueAndValidity()
      this.mailingAddress.controls['addrLine1'].updateValueAndValidity()
      this.mailingAddress.controls['city'].updateValueAndValidity()
      this.mailingAddress.controls['state'].updateValueAndValidity()
      this.mailingAddress.controls['zipCode'].updateValueAndValidity()
    } else {
      this.showMailingAddress = false;
      this.mailingAddress.controls['addressFormat'].clearValidators();
      this.mailingAddress.controls['addrLine1'].clearValidators();
      this.mailingAddress.controls['city'].clearValidators();
      this.mailingAddress.controls['state'].clearValidators();
      this.mailingAddress.controls['zipCode'].clearValidators();
      this.mailingAddress.controls['addressFormat'].updateValueAndValidity()
      this.mailingAddress.controls['addrLine1'].updateValueAndValidity()
      this.mailingAddress.controls['city'].updateValueAndValidity()
      this.mailingAddress.controls['state'].updateValueAndValidity()
      this.mailingAddress.controls['zipCode'].updateValueAndValidity()
    }
  }

}
