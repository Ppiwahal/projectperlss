import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../../services/appeal.service';

@Component({
  selector: 'app-onsite-assessment-results',
  templateUrl: './onsite-assessment-results.component.html',
  styleUrls: ['./onsite-assessment-results.component.scss']
})
export class OnsiteAssessmentResultsComponent implements OnInit {

  nfLevelCareforPAE: any[] = [];
  docummentObtained: any[] = [];
  onSiteAssessResultsForm: FormGroup;
  @Output() emitOnsiteAssessmentResults: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,private appealService: AppealService) { }

  ngOnInit(): void {
    this.onSiteAssessResultsForm = this.formBuilder.group({
      reviewedForSafetySw:['',Validators.required],
      atRiskLocNotMetSw: ['', Validators.required],
      nfLocPaeCd: ['', Validators.required],
      rnName:['', Validators.required],
      aplRqstDocObtainSw:[''],
    });

    this.appealService.getAppealDropdowns('NFLOC_STATUS').subscribe(res => {
      this.nfLevelCareforPAE = res;
    });

    this.appealService.getAppealDropdowns('YES_NO').subscribe(res => {
      this.docummentObtained = res;
    });
  }

  submitOnsiteAssesResults(form){
    this.emitOnsiteAssessmentResults.emit(form)
  }

}
