import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaeService } from '../../core/services/pae/pae.service';
import { PaeCommonService } from '../../core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { ComponentCanDeactivate } from 'src/app/core/helpers/pending-change.guard';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-pae-cost-neutrality-details',
  templateUrl: './pae-cost-neutrality-details.component.html',
  styleUrls: ['./pae-cost-neutrality-details.component.scss'],
})

export class PaeCostNeutralityDetailsComponent implements OnInit, ComponentCanDeactivate {
  isSamePageNavigation: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customValidator: CustomvalidationService,
    private location: Location,
    private dialog: MatDialog,
    public paeService: PaeService,
    public paeCommonService: PaeCommonService
  ) {

    this.myForm = this.fb.group({
      ONH: this.fb.array([]),
      OTH: this.fb.array([]),
      STH: this.fb.array([]),
      OGP: this.fb.array([]),
      STP: this.fb.array([])
    });

  }

  myForm: FormGroup;
  formControlNames: any = {};
  hasPaeIdError = false;
  pageId: string = 'PPCCD';
  dropdownData: any = {
    ONH: [
      {
        code: 'ADC',
        value: 'Adult Day Care',
      },
      {
        code: 'ACL',
        value: 'Assisted Care Living Facility',
      },
      {
        code: 'ATT',
        value: 'Attendant Care',
      },
      {
        code: 'CMG',
        value: 'Case Management (Ongoing)',
      },
      {
        code: 'CDA',
        value: 'CD Attendant Care',
      },
      {
        code: 'CDI',
        value: 'CD In-Home Respite',
      },
      {
        code: 'CDP',
        value: 'CD Personal Care Visits',
      },
      {
        code: 'CC5',
        value: 'Companion Care - 24/5',
      },
      {
        code: 'CC7',
        value: 'Companion Care - 24/7',
      },
      {
        code: 'TBI',
        value: 'Critical Adult Care Home - TBI',
      },
      {
        code: 'VNT',
        value: 'Critical Adult Care Home - Vent',
      },
      {
        code: 'HDM',
        value: 'Home Delivered Meals',
      },
      {
        code: 'PER',
        value: 'PERS (Monthly Fee)',
      },
      {
        code: 'PCV',
        value: 'Personal Care Visits',
      }
    ],
    OTH: [
      {
        code: 'AST',
        value: 'Assistive Technology',
      },
      {
        code: 'CMI',
        value: 'Case Management (Intake)',
      },
      {
        code: 'CIR',
        value: 'CD In-Home Respite',
      },
      {
        code: 'INR',
        value: 'In-Home Respite',
      },
      {
        code: 'IPR',
        value: 'Inpatient Respite',
      },
      {
        code: 'MHM',
        value: 'Minor Home Modifications',
      },
      {
        code: 'PER',
        value: 'PERS(Installation)',
      },
      {
        code: 'PEC',
        value: 'Pest Control',
      }
    ],
    OGP: [
      {
        code: 'HAH',
        value: 'Home Health Aide (Hour)',
      },
      {
        code: 'HAV',
        value: 'Home Health Aide (Visit)',
      },
      {
        code: 'PDH',
        value: 'Home Health/Private Duty Nurse (Hour)',
      },
      {
        code: 'PDV',
        value: 'Home Health/Private Duty Nurse (Visit)',
      }
    ],
    cost_frequency: [
      {
        code: 'DAY',
        value: 'Daily',
      },
      {
        code: 'WEK',
        value: 'Weekly',
      },
      {
        code: 'MTH',
        value: 'Monthly',
      },
      {
        code: 'YER',
        value: 'Yearly',
      }
    ],
    STH: [
      {
        code: 'ADC',
        value: 'ST/Add\'l Adult Day Care',
      },
      {
        code: 'ATT',
        value: 'ST/Add\'l Attendant Care',
      },
      {
        code: 'CAC',
        value: 'ST/Add\'l CD Attendant Care',
      },
      {
        code: 'CIR',
        value: 'ST/Add\'l CD In-Home Respite',
      },
      {
        code: 'CPV',
        value: 'ST/Add\'l CD Personal Care Visits',
      },
      {
        code: 'HDM',
        value: 'ST/Add\'l Home Delivered Meals',
      },
      {
        code: 'IHR',
        value: 'ST/Add\'l In-Home Respite',
      },
      {
        code: 'PCV',
        value: 'ST/Add\'l Personal Care Visits',
      }
    ],
    STP: [
      {
        code: 'HAH',
        value: 'Home Health Aide (Hour)',
      },
      {
        code: 'HAV',
        value: 'Home Health Aide (Visit)',
      },
      {
        code: 'PDH',
        value: 'Home Health/Private Duty Nurse (Hour)',
      },
      {
        code: 'PDV',
        value: 'Home Health/Private Duty Nurse (Visit)',
      }
    ],
  };

  public applicantData: Array<any>;

  options: any = {
    ONH: {
      hasItems: false,
      showAddButton: true,
      openedIndex: null,
      status: []
    },
    OTH: {
      hasItems: false,
      showAddButton: true,
      openedIndex: null,
      status: []
    },
    STH: {
      hasItems: false,
      showAddButton: true,
      openedIndex: null,
      status: []
    },
    OGP: {
      hasItems: false,
      showAddButton: true,
      openedIndex: null,
      status: []
    },
    STP: {
      hasItems: false,
      showAddButton: true,
      openedIndex: null,
      status: []
    },
  };

  applicantName: any;
  paeId: string;

  customValidation = customValidation;
  submitted = false;

  controlErrorText: any = {};

  fieldNameMap = { id: 'id', srvcAmt: 'amount', srvcFreqCd: 'frequency', srvcTypeCd: 'type' };
  fieldNameReverseMap = {};

  originalValues: any = {
    ONH: null,
    OTH: null,
    STH: null,
    OGP: null,
    STP: null
  };

  filteredTypes = {};
  dataMaps: any = {};

  get faONH(): FormArray {
    return this.myForm.get('ONH') as FormArray
  }
  get faOTH(): FormArray {
    return this.myForm.get('OTH') as FormArray
  }
  get faSTH(): FormArray {
    return this.myForm.get('STH') as FormArray
  }
  get faOGP(): FormArray {
    return this.myForm.get('OGP') as FormArray
  }
  get faSTP(): FormArray {
    return this.myForm.get('STP') as FormArray
  }

  getFilteredTypes(arrayName, index) {
    return this.filteredTypes[arrayName][index];
  }

  getPaeCostNeuDetailsData() {
    try {
      const that = this;
      this.paeService.getPaeCostNeutralityDetails(this.paeId).then(response => {
        console.log('costNeu:' + JSON.stringify(response, null, ' '));
        let data = response.body;
        let formCounts = {};
        if (data) {
          data.forEach(el => {
            let arrayName = el.costNeuTypeCd;
            if (!formCounts[arrayName]) {
              formCounts[arrayName] = 0;
            }
            formCounts[arrayName]++;
            that.addFormItem(arrayName, el, { submitted: true, dirty: false, saved: true, open: false });
          });
        }

        Object.keys(formCounts).forEach(key => {
          that.filterSelectedItems(key);
          that.options[key].hasItems = true;
          that.options[key].showAddButton = true;
          for (let i = 0; i < formCounts[key]; i++) {
            that.setControlState(key, i);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  filterSelectedItems(arrayName: string, addRow: boolean = false) {

    let length = this.options[arrayName].status.length;
    let selectedItems = {};

    for (var i = 0; i < length; i++) {
      let el = this.getValues(arrayName, i)
      selectedItems[el[arrayName + '_type']] = i;
    }
    let lists = [];
    let uData = this.dropdownData[arrayName];

    if (addRow) {
      length++;
    }
    for (var i = 0; i < length; i++) {
      let list = [];
      for (var j = 0; j < uData.length; j++) {
        let index = selectedItems[uData[j].code];
        let filter = false;
        if (typeof index !== 'undefined') {
          filter = index != i;
          console.log('filtered:' + arrayName + '[' + i + ']=' + filter)
        }
        if (!filter) {
          list.push(uData[j]);
        }
      }
      lists.push(list);
    }
    this.filteredTypes[arrayName] = lists;

  }

  addFormRow(arrayName: string) {
    this.filterSelectedItems(arrayName, true);
    let index = this.addFormItem(arrayName);
    let that = this;

    let options = that.options[arrayName];
    options.hasItems = true;
    options.status[index].ready = true;
    options.openedIndex = index;
  }

  addFormItem(arrayName: string, data: any = null, state: any = null): number {

    if (this.options[arrayName].locked) {
      return;
    }

    let formArray = this.myForm.controls[arrayName] as FormArray;

    if (!data) {
      data = {
        id: '',
        srvcAmt: '',
        srvcFreqCd: '',
        srvcTypeCd: ''
      }
    }

    let groupElements = {};
    groupElements[arrayName + '_id'] = new FormControl(data.id.toString());
    groupElements[arrayName + '_type'] = new FormControl(data.srvcTypeCd, { validators: [Validators.required], updateOn: 'blur' });
    groupElements[arrayName + '_amount'] = new FormControl(data.srvcAmt, { validators: [Validators.required, this.customValidator.currencyValidator()], updateOn: 'blur' });
    groupElements[arrayName + '_frequency'] = new FormControl(data.srvcFreqCd, { validators: [Validators.required], updateOn: 'blur' });

    const group = this.fb.group(groupElements);

    const keys = Object.keys(groupElements);

    if (!this.formControlNames[arrayName]) {
      this.originalValues[arrayName] = [];
      this.formControlNames[arrayName] = keys;
      for (let i = 0; i < keys.length; i++) {
        this.controlErrorText[keys[i]] = [];
      }
    }

    const ov = {};
    let that = this;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let dataItem = data[that.fieldNameReverseMap[key.split('_')[1]]];
      ov[key] = dataItem ? dataItem : '';
    }
    this.originalValues[arrayName].push(ov);

    let stateOptions = {
      edit: false,
      submitted: false,
      dirty: false,
      saved: false,
      open: false,
    };

    if (state) {
      Object.keys(state).forEach(key => { stateOptions[key] = state[key] });
    }

    this.options[arrayName].status.push(stateOptions);
    this.options[arrayName].showAddButton = false;

    let index = formArray.length;
    formArray.push(group);

    return index;
  }

  toggleOpen(arrayName: string, index: number) {

    const that = this;
    const action = '';
    const isOpen = this.options[arrayName].openedIndex == index;
    if (!isOpen) {
      this.setControlState(arrayName, index);
      this.options[arrayName].openedIndex = index;
    } else {
      this.options[arrayName].openedIndex = null;
    }
  }

  write(obj: any): String {
    return !obj ? 'null' : JSON.stringify(obj, null, '  ');
  }

  accordionLocked(arrayName: string) {
    const status = this.options[arrayName].status;
    let locked = false;
    for (let i = 0; i < status.length; i++) {
      locked = status[i].dirty || locked;
    }
  }

  delete(arrayName: string, index: number) {

    let values = this.getValues(arrayName, index);
    let that = this;

    let payload = {
      paeId: that.paeId,
      id: values[arrayName + '_id'],
      reqPageId: 'PPCCD'
    };

    if (payload.id && payload.id != '') {
      this.paeService.deletePaeCostNeutralityDetail(payload).then(response => {
        //never seems to get here;
      });
    }

    that.deleteHandler(arrayName, index);
  }

  deleteHandler(arrayName: string, index: number) {

    (this.myForm.controls[arrayName] as FormArray).removeAt(index);
    let options = this.options[arrayName];
    this.options[arrayName].status.splice(index, 1);
    this.originalValues[arrayName].splice(index, 1);
    this.formControlNames[arrayName].forEach(key => {
      this.controlErrorText[key].splice(index, 1);
    });
    options.hasItems = this.options[arrayName].status.length > 0;
    options.openedIndex = null,
      options.showAddButton = true;
    this.filterSelectedItems(arrayName);
  }

  edit(arrayName: string, index: number) {
    this.options[arrayName].status[index].edit = true;
    this.originalValues[arrayName][index] = this.getValues(arrayName, index);
    this.setControlState(arrayName, index);
  }

  getValues(arrayName: string, index: number) {
    return (this.myForm.controls[arrayName] as FormGroup).controls[index].value;
  }

  cancel(arrayName: string, index: number) {

    if (!this.options[arrayName].status[index].saved) {
      this.delete(arrayName, index);
      return;
    }

    const originalValues = this.originalValues[arrayName][index];
    const that = this;

    Object.keys(originalValues).forEach(controlName => {
      const control = that.getControl(controlName, index);
      control.setValue(originalValues[controlName]);
      control.markAsUntouched();
      control.setErrors(null);
      control.markAsPristine();
    });

    let options = that.options[arrayName];
    options.status[index].dirty = false;
    options.status[index].edit = true;
    options.openedIndex = null;
    that.setControlState(arrayName, index);

  }

  setControlState(arrayName: string, index: number) {
    const that = this;
    this.formControlNames[arrayName].forEach(controlName => {
      let control = that.getControl(controlName, index);
      if (that.options[arrayName].status[index].saved && !that.options[arrayName].status[index].edit) {
        control.disable();
      } else {
        control.enable();
      }
    });
    that.options[arrayName].status[index].ready = true;
  }

  ngOnInit(): void {

    this.paeId = this.paeCommonService.getPaeId();
    let that = this;
    Object.keys(this.fieldNameMap).forEach(key => {
      that.fieldNameReverseMap[that.fieldNameMap[key]] = key;
    })

    if (this.paeId) {
      this.getPaeCostNeuDetailsData();
    } else {
      this.hasPaeIdError = true;
    }

    if (this.paeCommonService.getApplicantName() === null || this.paeCommonService.getApplicantName() === '' || this.paeCommonService.getApplicantName() === undefined){
		this.getApplicantName();
	} else {
		this.applicantName =  this.paeCommonService.getApplicantName();
	}

  }

  getApplicantName(){
    this.paeService.getPaeApplicantInformation(this.paeCommonService.getPaeId(),this.pageId).then((response)=> {
      console.log("reponseforName"+JSON.stringify(response.body.firstName));
      this.applicantName =  response.body.firstName+" "+response.body.lastName;
	  this.paeCommonService.setApplicantName(this.applicantName);
    });
  }

  saveClick(arrayName: string, index: number) {

    try {

      let formArray = (this.myForm.get(arrayName) as FormArray);
      let baseForm = formArray.controls[index] as FormGroup;
      this.options[arrayName].status[index].submitted = true;
      baseForm.updateValueAndValidity();

      if (baseForm.valid) {

        let formData = baseForm.value;
        let that = this;

        let dataItem = {
          costNeuTypeCd: arrayName,
          paeId: that.paeId,
          reqPageId: 'PPCCD'
        }


        Object.keys(that.fieldNameMap).forEach(name => {
          let fieldName = arrayName + '_' + that.fieldNameMap[name];
          if (name != 'id' || formData[fieldName] !== null) {
            let value = formData[fieldName];
            if (name == 'srvcAmt') {
              value = Number(value);
            }
            dataItem[name] = value;
          }
        });

        this.paeService.savePaeCostNeutralityDetail(dataItem).then(response => {
          that.getControl(arrayName + '_id', index).setValue(response.body.id);
          that.options[arrayName].status[index].saved = true;
          that.options[arrayName].showAddButton = true;
          that.options[arrayName].openedIndex = null;
          that.filterSelectedItems(arrayName);
        });
      }
    } catch (e) {
      console.log('Error saving');
    }
  }

  getControl(controlName: string, index: number): AbstractControl {
    let arrayName = controlName.split('_')[0];
    let item = this.myForm.get(arrayName) as FormArray;
    return (item.controls[index] as FormGroup).controls[controlName] as AbstractControl;
  }

  mapValue(source: string, value: string): string {
    if (!this.dataMaps[source]) {
      const data = this.dropdownData[source];
      const map = {};
      data.forEach(el => {
        map[el.code] = el.value;
      });
      this.dataMaps[source] = map;
    }
    return this.dataMaps[source][value];
  }

  controlError(controlName: string, index: number) {
    try {
      const control = this.getControl(controlName, index);
      return this.controlErrorHandler(control, controlName, index);
    } catch (e) {
      console.log('unrecognized control name: ' + controlName);
    }
  }

  controlErrorHandler(control: AbstractControl, controlName: string, index: number) {
    let arrayName = controlName.split('_')[0];
    if (!this.options[arrayName].status[index]?.ready) {
      return false;
    }

    const error = (this.options[arrayName].status[index].submitted || control.touched) && !!control.errors;
    let message = '';

    if (!this.options[arrayName].status[index].dirty) {
      this.options[arrayName].status[index].dirty = this.originalValues[arrayName][index][controlName] != control.value;
    }

    if (error) {
      if (control.errors.invalidCurrency && control.value !== '') {
        message = 'Invalid currency value';
      } else if (control.errors.required) {
        message = customValidation.A1;
      }
    }
    this.controlErrorText[controlName][index] = message;
    return message !== '';
  }

  next(showPopup?: boolean) {
    this.isSamePageNavigation =  true;

    if (this.myForm.valid) {
      if (showPopup) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { route: 'ltss/pae' };
        // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '648px';
        dialogConfig.height = '360px';
        this.dialog.open(SavePopupComponent, dialogConfig);
      } else {
        this.paeService.navigateToChildNextPage('PPCCD');
      }
    }
  }

  saveAndExit() {
    this.next(true);
  }

  back() {
    this.isSamePageNavigation =  true;
    this.location.back();
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    console.log(this.myForm) 
   return this.isSamePageNavigation ? true : !this.myForm.dirty;
  }

  resetForm(){
    this.myForm.reset();
  }

}
