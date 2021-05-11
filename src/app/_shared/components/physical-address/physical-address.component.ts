import { EventEmitter, SimpleChanges } from '@angular/core';
import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddressService } from '../../services/address.service';
import { AddressValidationComponent } from '../address-validation/address-validation.component';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-physical-address',
  templateUrl: './physical-address.component.html',
  styleUrls: ['./physical-address.component.scss'],
})
export class PhysicalAddressComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  myForm: FormGroup;
  stateDropdowns = [];
  countyDropdowns = [];
  @Input() formData: any;
  @Input() hideValidation = false;
  @Input() showAddressType: boolean = false;
  @Input() isPhysicalAddress: boolean;
  addressFormat: any[] = []
  showMilAddressFormat: boolean;
  showUsFormatFields: boolean = true;
  customValidation = customValidation;
  militaryPo: any[] = [];
  militaryState: any[] =[];
  showCounty: boolean;
  @Input() toggleCounty: boolean = false;
  @Output() addressFormatChange = new EventEmitter();
  formSubmitted: boolean;

  constructor(private fb: FormBuilder, private addressService: AddressService, private matDialog: MatDialog) { }

  ngOnInit() {
    this.myForm = this.formData;
    const StateDropdownSubscriptions = this.addressService.getDropdownValues('STATE').subscribe(response => {
      this.stateDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(StateDropdownSubscriptions);
    const CountyDropdownSubscriptions = this.addressService.getDropdownValues('COUNTY').subscribe(response => {
      this.countyDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(CountyDropdownSubscriptions);

    const addressFormat = this.addressService.getDropdownValues('ADDRESS_FORMAT').subscribe(response => {
      this.addressFormat = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(addressFormat);
    
    const militaryPoSubscriptions = this.addressService.getDropdownValues('MILITARY_PO').subscribe(response => {
      this.militaryPo = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(militaryPoSubscriptions);

    const militaryStateSubscription = this.addressService.getDropdownValues('MILITARY_STATE').subscribe(response => {
      this.militaryState = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });

    this.subscriptions$.push(militaryStateSubscription);
    if(this.showAddressType){
      this.myForm.controls.addressFormat.setValue('US');
      this.myForm.controls['addressFormat'].enable();
    }

  }

  
  ngOnChanges(change: SimpleChanges){
    if(this.toggleCounty){
      this.stateChanged('TN');
    } else {
      this.stateChanged('');
    }
  }


  get f() {
    return this.myForm.controls;
  }



  executeValidation() {
    this.formSubmitted = true;
    if (this.myForm.status === 'INVALID') {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40vw';
    dialogConfig.height = '29vw';
    dialogConfig.data = {
      addrLine1: this.myForm.value.addrLine1,
      addrLine2: this.myForm.value.addrLine2,
      city: this.myForm.value.city,
      state: this.myForm.value.state,
      zipCode: this.myForm.value.zipCode,
      ext: this.myForm.value.ext,
      county: this.myForm.value.county
    };
    const dialogRef = this.matDialog.open(AddressValidationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(address => {
      if (address) {
        this.myForm.controls.addrLine1.setValue(address.addrLine1);
        this.myForm.controls.addrLine2.setValue(address.addrLine2);
        this.myForm.controls.city.setValue(address.city);
        this.myForm.controls.state.setValue(address.state);
        this.myForm.controls.zipCode.setValue(address.zipCode);
        this.myForm.controls.ext.setValue(address.ext);
        console.log(address);
      }
    });
  }

  onAddressFormatChanged(code){
    if(code == 'MA'){
      this.showMilAddressFormat = true;
      this.showUsFormatFields = false;
      this.myForm.controls['apoFpo'].enable();
      this.myForm.controls['aaAeAp'].enable();
      this.myForm.controls['city'].disable();
      this.myForm.controls['state'].disable();
      this.myForm.controls['county'].disable();
    } else {
      this.showMilAddressFormat = false;
      this.showUsFormatFields = true;
      this.myForm.controls['apoFpo'].disable();
      this.myForm.controls['aaAeAp'].disable();
      this.myForm.controls['city'].enable();
      this.myForm.controls['state'].enable();
      this.myForm.controls['county'].enable();
    }
    this.addressFormatChange.emit(code);
  }

  stateChanged(value){
    if(value.trim() == 'TN'){
      this.showCounty = true;
    } else {
      this.showCounty = false;
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
