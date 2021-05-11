
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as customValidation from '../../_shared/constants/validation.constants';
import { CustomvalidationService } from '../../_shared/utility/customvalidation.service';
import { ChangeManagementService } from '../../core/services/change-management/change-management.service';
import { Subscription } from 'rxjs';
import { elementClosest } from '@fullcalendar/angular';

@Component({
  selector: 'cm-entity-association',
  templateUrl: './cm-entity-association.component.html',
  styleUrls: ['./cm-entity-association.component.scss']
})

export class CmEntityAssociationComponent implements OnInit {

  customValidation = customValidation;
  submitted = false;
  myForm: FormGroup;
  errorText: Array<string> = [];
  subscribed: Array<Subscription> = [];
  personData: any;
  program: string;
  entities: any[] = [];
  entityData: Array<any> = [];
  entityName: any;
  entityCode: any[] = [
  ];
  sentence: any;
  summaryDataList: any;
  dataSource = [];
  dataSourceSet = false;
  entityCdMain = [];
  entityId: any;
  medDiagnosisDoc: any;
  dataElement: any;
  constructor(
    fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private changeManagementService: ChangeManagementService
  ) {
    this.myForm = fb.group({
      search: [''],
      entity: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

     this.changeManagementService.getEntityAssociate().subscribe((response) => {
      this.summaryDataList = response;
      // var item = this.summaryDataList.find(item => item.entityId === this.entityId);
      this.entityId = this.summaryDataList.entityId;
      console.log('diagnosisResponse', response);
    });

     this.subscribed.push(
      this.changeManagementService.personData$.subscribe(personData => {
        this.personData = personData;
        if (this.personData) {
          this.entityCode = this.personData.entity;
          this.entityName = '';
          this.personData.entity.forEach(element => {
            console.log('this.personData', this.personData);
            this.entityName = this.entityName + element.entityName + ', ';
            this.sentence = this.entityName.replace(/,(?=\s*$)/, '');
            this.entities.push(element.entityCd[0]);
            this.dataElement = element.entityCd[0].entityCd
            console.log('entities', this.entities, element.entityCd[0]);
            /* for (let i = 0; i < element.entityCd.length; i++) {
              this.entities.push({
                entityCd: element.entityCd[i]
              });
              console.log('entities', this.entities, element.entityCd[i]);
            } */
          });
          this.entityName = this.entityName.trim().substring(0, this.entityName.length - 1);
          this.setForm();
        }

        // this.fixControls();
      })
    );
  }
  setForm() {
    this.myForm.controls.entity.setValue(this.entities);


  }
    selectEntity(event) {
      console.log('event====', event);
      for (let eventCount = 0; eventCount < event.length; eventCount++) {
        if (this.summaryDataList.indexOf(event[eventCount].entityCd) == -1) {
          this.summaryDataList.push(event[eventCount].entityCd);
        }
      }
  }
  getFormData() {
    return this.myForm.controls;
  }
  fixControls() {

    const that = this;

    const timeout = setTimeout(function() {
      Object.keys(that.myForm.controls).forEach(controlName => {
        if (controlName != 'search') {
          const control = that.myForm.controls[controlName];
          if (control.errors) {
            const errorKeys = Object.keys(control.errors);
            errorKeys.forEach(key => {
              delete control.errors[key];
            });
          }
          control.setErrors(null);
          control.markAsUntouched();
          that.errorText[controlName] = null;
        }
      });
      clearTimeout(timeout);
    }, 100);
  }

  controlError(controlName: string): boolean {

    let error = null;
    try {
      const control = this.myForm.controls[controlName];
      if ((this.submitted || control.touched) && control.errors) {
        if (controlName.slice(-4) == 'Date' && control.errors.matDatepickerParse?.text !== null && control.status == 'INVALID') {
          error = customValidation.BD;
        } else if (control.errors.dateInFuture) {
          error = customValidation.A5;
        } else if (control.errors.dateInPast) {
          error = customValidation.A15;
        } else if (control.errors.required) {
          error = customValidation.A1;
        }
      }
    } catch (e) {
      console.log('bad control name: ' + controlName);
    }

    this.errorText[controlName] = error;
    return error != null;

  }

  save() {
    this.submitted = true;
    if (this.myForm.valid) {
      const entityCd = [];
      for (let i = 0; i < this.summaryDataList.length; i++) {
        const data = this.summaryDataList[i].entityId;
        console.log('this.entityCd[i]', this.summaryDataList[i], data, this.dataElement);
        if (this.dataElement === data){
          entityCd.push({
            'entityCd': data,
            'entitySw': ''
          });
        }

      }
      const data = {
        assignedMcoSw: this.personData.entity[0].assignedMcoSw,
        effBeginDt: this.personData.entity[0].effBeginDt,
        effEndDt: this.personData.entity[0].effEndDt,
        entityCd,
        entityTypeCd: this.personData.entity[0].entityTypeCd,
        paeId: this.personData.entity[0].paeId,
        prsnId: this.personData.personId,
        refId: this.personData.entity[0].refId,
        reqPageId: 'PERAI',
      };
      this.changeManagementService.entityAssociationSubmit(data).subscribe(res => {
      });

    }
}
}
