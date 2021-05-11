import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';
import * as customValidation from '../../../_shared/constants/validation.constants';

@Component({
  selector: 'app-appeal-type-pasrr',
  templateUrl: './appeal-type-pasrr.component.html',
  styleUrls: ['./appeal-type-pasrr.component.scss']
})
export class AppealTypePasrrComponent implements OnInit {

  appealTypeForm: FormGroup;
  @Input() payorSource: any;
  @Input() pasrrReason: any;
  @Output() addPasrrEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() pasrrAdverseReason: any;
  customValidation = customValidation;
  maxDate: Date = new Date();

  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  

  ngOnInit(): void {
    this.appealTypeForm = this.formBuilder.group({
      pasrrReason: ['', Validators.required],
      payorSource: ['', Validators.required],
      pasrrActionReason: ['',Validators.required],
      pasrrActionDate: ['', Validators.required],
      clientId:['',  [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]],
      episodeId:['',  [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]]
    });

  }

  f(){
    return this.appealTypeForm.controls;
  }

  submitAppealType(data, pasrrForm:FormGroup){
      this.addPasrrEmitter.emit({data: data, form: pasrrForm});
  }

}
