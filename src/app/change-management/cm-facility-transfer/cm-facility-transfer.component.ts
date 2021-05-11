import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { AddressService } from '../../_shared/services/address.service';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cm-facility-transfer',
  templateUrl: './cm-facility-transfer.component.html',
  styleUrls: ['./cm-facility-transfer.component.scss']
})
export class CmFacilityTransferComponent implements OnInit, OnDestroy {
  customValidation = customValidation;
  errorText: any = {};
  paeId: string;
  submitted = false;
  address = false;
  stateDropdowns = [];
  countyDropdowns = [];
  facilityName = [];
  minDate: Date;
  subscribed: Array<Subscription> = [];
  personData: any;
  addressLine1;
  addressLine2;
  city;
  stateCd;
  zip;
  subscriptions$: any[] = [];

  facilityForm: FormGroup;
  constructor(private fb: FormBuilder, private addressService: AddressService, private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService
  ) { }

  ngOnInit(): void {
    this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        if (this.personData.data && this.personData.data != null) {
          this.address = true;
          this.addressLine1 = this.personData.data.addrLine1;
          this.addressLine2 = this.personData.data.addrLine2;
          this.city = this.personData.data.city;
          this.stateCd = this.personData.data.stateCd;
          this.zip = this.personData.data.zip;
          this.setFormA();
        }
      })
    );
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 119, 0, 1);
    const StateDropdownSubscriptions = this.addressService.getDropdownValues('STATE').subscribe(response => {
      this.stateDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(StateDropdownSubscriptions);


    const CountyDropdownSubscriptions = this.addressService.getDropdownValues('COUNTY').subscribe(response => {
      this.countyDropdowns = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(CountyDropdownSubscriptions);

    const facilityNamesSubscriptions = this.changeManagementService.getStaticDataValues().subscribe(response => {
      this.facilityName = response.sort((a, b) => (a.value > b.value) ? 1 : -1);
    });
    this.subscriptions$.push(facilityNamesSubscriptions);


    this.facilityForm = this.fb.group({
      providerNumber: [''],
      dischargeDate: ['', Validators.required],
      facilityName: ['', Validators.required],
      admitterProviderNumber: [''],
      addmissionDate: ['', Validators.required],
      addressLine1Txt: ['', [Validators.required]],
      addressLine2Txt: [''],
      cityTxt: ['', [Validators.required]],
      countyCd: ['', [Validators.required]],
      ext: [''],
      stateCd: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      phoneNumber: [''],
      commentTxt: ['', [Validators.required]]
    });
  }
  getFormData() {
    return this.facilityForm.controls;
  }
  setFormA() {
    var addressInfo = this.personData.data;
    this.facilityForm.controls['addressLine1Txt'].setValue(addressInfo.addrLine1);
    this.facilityForm.controls['addressLine2Txt'].setValue(addressInfo.addrLine2);
    this.facilityForm.controls['addmissionDate'].setValue(addressInfo.admissionDt);
    this.facilityForm.controls['dischargeDate'].setValue(addressInfo.anticipatedDischargeDt);
    this.facilityForm.controls['cityTxt'].setValue(addressInfo.city);
    this.facilityForm.controls['stateCd'].setValue(addressInfo.stateCd);
    this.facilityForm.controls['zipCode'].setValue(addressInfo.zip);
    this.facilityForm.controls['ext'].setValue(addressInfo.ext);
    this.facilityForm.controls['countyCd'].setValue(addressInfo.cntyCd);
    this.facilityForm.controls['facilityName'].setValue(addressInfo.nursingFacilityNameCd);
  }

  onSubmit() {
    if (this.facilityForm.valid) {
      let data = {
        addrLine1: this.getFormData().addressLine1Txt.value,
        addrLine2: this.getFormData().addressLine2Txt.value,
        admissionDt: this.getFormData().addmissionDate.value,
        admitProviderId: this.getFormData().admitterProviderNumber.value,
        chmTypeCd: 'FITR',
        city: this.getFormData().cityTxt.value,
        cntyCd: this.getFormData().countyCd.value,
        comments: this.getFormData().commentTxt.value,
        dischargeDt: this.getFormData().dischargeDate.value,
        facilityCd: this.getFormData().facilityName.value,
        paeId: this.personData.paeId,
        phNum: this.getFormData().phoneNumber.value,
        providerId: this.getFormData().providerNumber.value,
        prsnId: this.personData.personId,
        stateCd: this.getFormData().stateCd.value,
        zip: this.getFormData().zipCode.value,
        zipExtn: this.getFormData().ext.value
      }
      const updatefacilityTransferSubscriptions = this.changeManagementService.updateFaciltyTransfer(data).subscribe(res => {
      });
      this.subscriptions$.push(updatefacilityTransferSubscriptions);


    }

  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
