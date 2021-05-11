import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-appeal-decision',
  templateUrl: './appeal-decision.component.html',
  styleUrls: ['./appeal-decision.component.scss']
})
export class AppealDecisionComponent implements OnInit {

  appealDecision: any[] = [];
  showAppealDecision: boolean;
  appealDecisionForm: FormGroup;
  @Input() showAppealClosure: any;
  showDenialReason: boolean;
  @Input() onsiteAssesReq: boolean;
  @Input() appealType: any;
  @Input() showOnlyAppealDecision: boolean;
  @Output() emitAppealDecision: EventEmitter<any> = new EventEmitter<any>();
  appealDenial: any;
  constructor(private formBuilder: FormBuilder, private appealService: AppealService) { }

  ngOnInit(): void {
    const appealDecision$ =  this.appealService.getAppealDropdowns('APPEAL_DECISION').subscribe(res => {
      this.appealDecision = res
    });
    this.appealService.getAppealDropdowns('APPEAL_DENIAL').subscribe(res => {
      this.appealDenial = res
    });
    this.appealDecisionForm = this.formBuilder.group({
      appealDecision:['', [Validators.required]],
      appealDenialReason:['']
    });
  }

  ngOnChanges(){
      if(this.appealDecisionForm !== undefined){
        if(this.showAppealClosure){
          this.showAppealDecision = true;
          this.appealDecisionForm.controls['appealDecision'].setValue('CL');
          this.showDenialReason = false;
          this.emitAppealDecision.emit(this.appealDecisionForm)
          return;
        } else {
          this.showAppealDecision = false;
          this.appealDecisionForm.controls['appealDecision'].setValue('');
        }
      } 

        if(this.onsiteAssesReq && !this.showAppealClosure){
          this.showAppealDecision = true;
          // this.showDenialReason = true;
        } else {
          this.showAppealDecision = false;
          this.showDenialReason = false;
        }

        if(this.appealType == 'DE' || this.appealType == 'EN' || this.appealType === 'PR' || this.appealType === 'RF'){
          if(this.showOnlyAppealDecision){
            this.showAppealDecision = true;
          }
        }
    }


  appealDecisionChanged(form){
    if(form.value.appealDecision == 'HO'){
        this.showDenialReason = true
    } else {
      this.showDenialReason = false
    }
    this.emitAppealDecision.emit(form)
  }

  appealDenialChanged(form){
    this.emitAppealDecision.emit(form)
  }

}
