import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AppealService} from '../../services/appeal.service'

@Component({
  selector: 'app-appeal-representative',
  templateUrl: './appeal-representative.component.html',
  styleUrls: ['./appeal-representative.component.scss']
})
export class AppealRepresentativeComponent implements OnInit {

  toggleIcon: boolean = true;
  showRepresentaiveAccordion:boolean = false;
  representativeFormData: any = [];
  showRepresentativeForm: boolean;
  @Input() nameSuffix: any;
  @Input() relationshipToAppellant: any;
  @Input() verificationSource: any;
  @Input() phoneType: any;
  @Output() representativeListEmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit(): void {

  }

  addRepresentatives(){
    this.toggleIcon = !this.toggleIcon;
    if(this.toggleIcon){
      this.showRepresentativeForm = false;
    } else {
      this.showRepresentativeForm = true;
    }
  }

  saveRepresentaviveData(data){
    this.showRepresentaiveAccordion = true;
    this.toggleIcon = true;
    this.showRepresentativeForm = false;
    this.representativeFormData.push(data)
    this.representativeFormData.forEach( (data, i) => {
      data.index = i;
    })
    this.representativeListEmit.emit(this.representativeFormData);
  }

  finalRepresentativeList(data){
    this.representativeFormData = data;
    this.representativeListEmit.emit(data);
  }

  cancel(){
    this.showRepresentativeForm = false;
    this.toggleIcon = true;
  }

}
