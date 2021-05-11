import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-onsite-assessment-correction',
  templateUrl: './onsite-assessment-correction.component.html',
  styleUrls: ['./onsite-assessment-correction.component.scss']
})
export class OnsiteAssessmentCorrectionComponent implements OnInit {

  yesOrNo: any[] = [{code:'Y', value:'Yes'}, {code:'N', value:'No'}]
  showCorrection: boolean;
  nrawAssessAcuityScore: any[] = [];
  @Output() emitOnsiteAssesCorrection: EventEmitter<any> = new EventEmitter<any>();
  onsiteCorrectnForm: FormGroup;
  
  constructor(private appealService: AppealService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.appealService.getAppealDropdowns('ANRAGREE_ACUITYSCORE').subscribe(res => {
      this.nrawAssessAcuityScore = res;
    });

    this.onsiteCorrectnForm = this.formBuilder.group({
      corctnRqstdSw:['', Validators.required],
      agreeAcutyScoreCd: [''],
      corctnComments: ['']
    });
    
  }

  assessmentCorrectionChanged(value){
    if(value === 'Y'){
      this.showCorrection = true
      this.onsiteCorrectnForm.controls['agreeAcutyScoreCd'].setValidators(Validators.required);
      this.onsiteCorrectnForm.controls['corctnComments'].setValidators(Validators.required);
    } else {
      this.showCorrection = false
      this.onsiteCorrectnForm.controls['agreeAcutyScoreCd'].clearValidators();
      this.onsiteCorrectnForm.controls['corctnComments'].clearValidators();
    }
      this.onsiteCorrectnForm.controls['agreeAcutyScoreCd'].updateValueAndValidity();
      this.onsiteCorrectnForm.controls['corctnComments'].updateValueAndValidity();
      this.emitOnsiteAssesCorrection.emit(value);
  }

  submitForm(form){
    if(form.valid){
      this.appealService.aplOnsiteCorrection("", "").subscribe(res => {
       console.log(res)
      });
    }

  }

}
