import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppealService } from '../../services/appeal.service';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const ELEMENT_DATA1: any[] = [
  {
    "funcMeasureCd": "TRAN",
    "adjActionCd": "",
    "adjApprovalCd": "AL",
    "adjDenialCd": "NA",
    "adjAcuityScoreNum": 0,
    "aplRspCd": "AL",
    "aplAcuityScore": 0,
    "aplComments": ""
},
{
  "funcMeasureCd": "MOBL",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},
{
  "funcMeasureCd": "MOBW",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "EATG",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "TLTG",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "TLTI",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "TLTC",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "ORNT",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "ECOM",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "RCOM",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  "funcMeasureCd": "MEDC",
  "adjActionCd": "",
  "adjApprovalCd": "AL",
  "adjDenialCd": "NA",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "AL",
  "aplAcuityScore": 0,
  "aplComments": ""
},{
  
  "funcMeasureCd": "BHVR",
  "adjActionCd": "",
  "adjApprovalCd": "NE",
  "adjDenialCd": "AL",
  "adjAcuityScoreNum": 0,
  "aplRspCd": "NE",
  "aplAcuityScore": 0,
  "aplComments": ""
}

];

const ELEMENT_DATA2: any[] = [
  {
    assessmentGroup: 'Transfer, Mobility, and Mobility Wheelchair',
    maxAcuityGroup: 0,
    code:'TMMW'
  },
  {
    assessmentGroup: 'Eating',
    maxAcuityGroup: 0,
    code:'E'
  },
  {
    assessmentGroup: 'Toileting, Toileting-Incontinence, and Toileting - Catheter/Ostomy',
    maxAcuityGroup: 0,
    code:'TTTC'
  },
  {
    assessmentGroup: 'Orientation',
    maxAcuityGroup: 0,
    code:'O'
  },
  {
    assessmentGroup: 'Expressive Communication and Receptive Communication',
    maxAcuityGroup: 0,
    code:'ECRC'
  },
  {
    assessmentGroup: 'Medication',
    maxAcuityGroup: 0,
    code:'M'
  },
  {
    assessmentGroup: 'Behaviors',
    maxAcuityGroup: 0,
    code:'B'
  },
  {
    assessmentGroup: 'Total Acuity Score',
    maxAcuityGroup: 0,
    code:'TAC'
  }
]

@Component({
  selector: 'app-onsite-evaluation',
  templateUrl: './onsite-evaluation.component.html',
  styleUrls: ['./onsite-evaluation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class OnsiteEvaluationComponent implements OnInit {

  // dataSource1 = ELEMENT_DATA1;
  columnsToDisplay1: string[] = ['functionalMeasure', 'adjudicatorsAction', 'adjudicatedResponse', 'AdjudicatedAcuityScore', 'appealResponse', 'appealAcuityScore'];
  dataSource2 = ELEMENT_DATA2;
  columnsToDisplay2: string[] = ['assessmentGroup', 'maxAcuityGroup'];
  expandedElement: any | null;
  functionalAssessment: any[] = [];
  acuityPayload: any;
  functionalMeasureCd: any;
  @Input() onsiteAssessmentOnLoad: any;
  onSiteEvaluationForm: FormGroup;
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  adjAcuityScoreNum: any = 0;
  aplAcuityScore: any = 0;  
  maxAccuityScore: { trnsfrMobltyMaxActyScore: any; eatingMaxActyScore: any; toilMaxActyScore: any; orientMaxActyScore: any; commMaxActyScore: any; medMaxActyScore: any; behavrlMaxActyScore: any; totalAssessedActyScore: any; };
  @Output() emitOnsiteEvaluation: EventEmitter<any> = new EventEmitter<any>();
  @Input() appealReviewAplId: any;
  displayMobWheelChair: string = '';
  startDate = new Date();
  
//   [{"code": "AL", "value":"Always","activateSW":"Y"},
// {"code": "US", "value":"Usually","activateSW":"Y"},
// {"code": "UN", "value":"Usually Not","activateSW":"Y"},
// {"code": "NE", "value":"Never","activateSW":"Y"}]
  constructor(private appealService: AppealService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
    if(timeTravelData) {
      const timeTravelDataJson = JSON.parse(CryptoJS.AES.decrypt(timeTravelData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8));
      console.log("timeTravelDataJson ", timeTravelDataJson);
      if(timeTravelDataJson.timeTravelFlag && timeTravelDataJson.currentDate) {
        this.startDate = new Date(timeTravelDataJson.currentDate);
      }
    }
    this.onSiteEvaluationForm = this.formBuilder.group({
      assessedBy:['', Validators.required],
      assessmentDate: ['', Validators.required],
      finaByRegisNurseReviewer:['', Validators.required],
      determinationDate: ['', Validators.required],
      amendateDate:['']
    });
    const reasonOnHold$ = this.appealService.getAppealDropdowns('FUNCTIONAL_ASSESSMENT').subscribe(res => {
      this.functionalAssessment = res;
    });
    this.appealService.getAppealDropdowns('FUNCTIONAL_MEASURE_CD').subscribe(res => {
      this.functionalMeasureCd = res;
    });
  }


  ngOnChanges(){
    if(this.onsiteAssessmentOnLoad){
      if(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.length > 0){
        this.dataSource1 = new MatTableDataSource(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs);
      } else {
        this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs = ELEMENT_DATA1;
        this.dataSource1 = new MatTableDataSource(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs);
      }
      if(this.functionalMeasureCd){
        this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach(data => {
          this.displayMobilityWheelchair(data);
          this.functionalMeasureCd.forEach( ele =>{
              if(data.funcMeasureCd == ele.name){
                data.name = ele.value;
              }
          })
        })
      }
      this.setMaxAccuityScoreOnLoad(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalAssesmentGroupVO);
      this.onSiteEvaluationForm.controls['assessedBy'].setValue(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.assessedBy);
      this.onSiteEvaluationForm.controls['assessmentDate'].setValue(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.assessDt);
      this.onSiteEvaluationForm.controls['finaByRegisNurseReviewer'].setValue(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.rnReviewer);
      this.onSiteEvaluationForm.controls['determinationDate'].setValue(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.deterDt);
    }
  }


  adjActionSelected(event, element, code){
    event.stopPropagation();
    element.adjActionCd = code;
  }

  displayMobilityWheelchair(row){
    if(row.funcMeasureCd === 'MOBL'){
      if( row.adjApprovalCd === 'UN' || row.aplRspCd === 'UN' || row.adjApprovalCd === 'NE' || row.aplRspCd === 'NE'){
        this.displayMobWheelChair = '';
      } else {
        this.displayMobWheelChair = 'none';
      }
    }
      
  }

  onAdjuResponseChanged(element, code){
    element.adjApprovalCd = code;
    this.displayMobilityWheelchair(element);
    let payLoad = this.createAcuityPayLoad();
    this.appealService.getAcuityScore(this.appealReviewAplId, payLoad).subscribe(res => {
      this.setAcuityResponse(res)
      this.setAcuityMaxScore(res)
    });
    if(element.adjApprovalCd === element.aplRspCd){
       this.expandedElement = null;
    } else {
      if(element.aplComments === ""){
        this.expandedElement = element;
       }
    }
  }

  onAppealResponseChanged(element, code){
    element.aplRspCd = code;
    this.displayMobilityWheelchair(element);
    let payLoad = this.createAcuityPayLoad();
    this.appealService.getAcuityScore(this.appealReviewAplId, payLoad).subscribe(res => {
      this.setAcuityResponse(res)
      this.setAcuityMaxScore(res)
    });
    if(element.adjApprovalCd === element.aplRspCd){
      this.expandedElement = null;
   } else {
     if(element.aplComments === ""){
      this.expandedElement = element;
     }
   }
  }


  createAcuityPayLoad(){
    let payLoad = {
      "adjFunctionalMeasureReqVO":{}
    }
    this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach( data => {
      if(data.funcMeasureCd == 'TRAN'){
        payLoad['transfer']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_transfer'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'MOBL'){
        payLoad['mobilityWalking']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_mobility'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'MOBW'){
        payLoad['mobilityWheelchair']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_mobilityWheelchair'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'EATG'){
        payLoad['eating']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_eating'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'TLTG'){
        payLoad['toileting']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_toileting'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'TLTI'){
        payLoad['incontCare']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_incontCare'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'TLTC'){
        payLoad['cathOstomyCare']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_cathOstomyCare'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'ORNT'){
        payLoad['orientation']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_orientation'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'ECOM'){
        payLoad['expressiveCom']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_expressiveCom'] = data.adjApprovalCd
      } else if(data.funcMeasureCd == 'RCOM'){
        payLoad['receptiveCom']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_receptiveCom'] = data.adjApprovalCd
      }else if(data.funcMeasureCd == 'MEDC'){
        payLoad['selfAdminOfMed']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_selfAdminOfMed'] = data.adjApprovalCd
      }else if(data.funcMeasureCd == 'BHVR'){
        payLoad['behavior']= data.aplRspCd
        payLoad['adjFunctionalMeasureReqVO']['adj_behavior'] = data.adjApprovalCd
      }
    })
    return payLoad;
  }

  setAcuityResponse(res){
    this.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreMobilityTotal;
    this.aplAcuityScore = res.mobilityTotal;  
    this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach(data => {
      if(data.funcMeasureCd == 'TRAN'){
        data.aplAcuityScore = res.transferMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreTransfer;
      }else if(data.funcMeasureCd == 'MOBL'){
        data.aplAcuityScore = res.mobilityMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreMobility;
      }else if(data.funcMeasureCd == 'MOBW'){
        data.aplAcuityScore = res.mobilityWheelchairMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreMobilityWheelchair;
      }else if(data.funcMeasureCd == 'EATG'){
        data.aplAcuityScore = res.eatingMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreEating;
      }else if(data.funcMeasureCd == 'TLTG'){
        data.aplAcuityScore = res.toiletingMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreToileting;
      }else if(data.funcMeasureCd == 'TLTI'){
        data.aplAcuityScore = res.toiletingInconMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreIncontinenceCare;
      }else if(data.funcMeasureCd == 'TLTC'){
        data.aplAcuityScore = res.toiletingCathOstMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreCatheterOstomyCare;
      }else if(data.funcMeasureCd == 'ORNT'){
        data.aplAcuityScore = res.orientationMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreOrientation;
      }else if(data.funcMeasureCd == 'ECOM'){
        data.aplAcuityScore = res.communicationExpMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreExpressiveCommunication;
      }else if(data.funcMeasureCd == 'RCOM'){
        data.aplAcuityScore = res.communicationRecMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreReceptiveCommunication;
      }else if(data.funcMeasureCd == 'MEDC'){
        data.aplAcuityScore = res.medicationMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreMedical;
      }else if(data.funcMeasureCd == 'BHVR'){
        data.aplAcuityScore = res.behaviorMeasureNum;
        data.adjAcuityScoreNum = res.adjFunctionalMeasureResVO.scoreBehaviors;
      }
    })
  }

  setAcuityMaxScore(res){
    if(res){
      ELEMENT_DATA2.forEach( data => {
        if(data.code == 'TMMW'){
          data.maxAcuityGroup = res.maxScoreTransferMobility;
        } else if(data.code == 'E'){
          data.maxAcuityGroup = res.maxScoreEating;
        }else if(data.code == 'TTTC'){
          data.maxAcuityGroup = res.maxScoreToiletingIncontCathOstomy;
        }else if(data.code == 'O'){
          data.maxAcuityGroup = res.maxScoreOrientation;
        }else if(data.code == 'ECRC'){
          data.maxAcuityGroup = res.maxScoreExpressiveReceptiveComm;
        }else if(data.code == 'M'){
          data.maxAcuityGroup = res.maxScoreMedication;
        }else if(data.code == 'B'){
          data.maxAcuityGroup = res.maxScoreBehaviors;
        }else if(data.code == 'TAC'){
          data.maxAcuityGroup = res.maxScoreAcuityTotal;
        }
      })
      this.maxAccuityScore = this.generateMaxAcuityScorePayLoadForSave(res);
    }
  }

  generateMaxAcuityScorePayLoadForSave(res){
    let payLoad = {
        "trnsfrMobltyMaxActyScore":  res.maxScoreTransferMobility,
        "eatingMaxActyScore":  res.maxScoreEating,
        "toilMaxActyScore": res.maxScoreToiletingIncontCathOstomy,
        "orientMaxActyScore": res.maxScoreOrientation,
        "commMaxActyScore": res.maxScoreExpressiveReceptiveComm,
        "medMaxActyScore": res.maxScoreMedication,
        "behavrlMaxActyScore": res.maxScoreBehaviors,
        "totalAssessedActyScore": res.maxScoreAcuityTotal
    }
    return payLoad
  }

  onSiteEvaluationSbmit(form){
    let isCommentsValid = true;
    this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach(data => {
      if(data.adjApprovalCd !== data.aplRspCd && data.aplComments === ""){
        isCommentsValid = false;
        return false;
      }
    })
   if(form.valid && isCommentsValid){
    let isTotalMoblityExist: boolean = this.mobilityExits(this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs);
    this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach(data => {
      this.functionalMeasureCd.forEach( ele =>{
          if(data.funcMeasureCd == ele.value){
            data.funcMeasureCd = ele.name;
          }
      })
    })

    if(isTotalMoblityExist){
      this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.forEach( data => {
        if(data.funcMeasureCd === 'MOBT'){
          data.adjAcuityScoreNum = this.adjAcuityScoreNum;
          data.aplAcuityScore = this.aplAcuityScore
          data.funcMeasureCd = 'MOBT'
        }
      })
    } else {
      this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs.push(
        {        
          "adjAcuityScoreNum": this.adjAcuityScoreNum,  
          "aplAcuityScore": this.aplAcuityScore,      
          "funcMeasureCd": "MOBT"
        }
      )
    }
    let payLoad = {
          "appealOnsiteEvaluationVO": {
              "appealOnsiteEvalAssesmentGroupVO": this.maxAccuityScore,
              "appealOnsiteEvalFunMeasuresVOs": this.onsiteAssessmentOnLoad.appealOnsiteEvaluationVO.appealOnsiteEvalFunMeasuresVOs,
              "assessDt": form.value.assessmentDate,
              "assessedBy":  form.value.assessedBy,
              "deterDt":  form.value.determinationDate,
              "rnReviewer":  form.value.finaByRegisNurseReviewer
          }
        }
    this.emitOnsiteEvaluation.emit(payLoad)
   }
  }

  mobilityExits(data) {
    return data.some( el => {
      return el.funcMeasureCd === 'MOBT';
    }); 
  }

  expandElement(expandedElement, element){
    this.expandedElement = expandedElement === element ? null : element
  }

  onCommentChange(element, event){
    element.aplComments = event.target.value;
  }

  setMaxAccuityScoreOnLoad(res){
    if(res){
      ELEMENT_DATA2.forEach( data => {
        if(data.code == 'TMMW'){
          data.maxAcuityGroup = res.trnsfrMobltyMaxActyScore;
        } else if(data.code == 'E'){
          data.maxAcuityGroup = res.eatingMaxActyScore;
        }else if(data.code == 'TTTC'){
          data.maxAcuityGroup = res.toilMaxActyScore;
        }else if(data.code == 'O'){
          data.maxAcuityGroup = res.orientMaxActyScore;
        }else if(data.code == 'ECRC'){
          data.maxAcuityGroup = res.commMaxActyScore;
        }else if(data.code == 'M'){
          data.maxAcuityGroup = res.medMaxActyScore;
        }else if(data.code == 'B'){
          data.maxAcuityGroup = res.behavrlMaxActyScore;
        }else if(data.code == 'TAC'){
          data.maxAcuityGroup = res.totalAssessedActyScore;
        }
      })
      this.maxAccuityScore = this.generateMaxAcuityScorePayLoadonLoad(res);
    }
  }

  generateMaxAcuityScorePayLoadonLoad(res){
    let payLoad = {
        "trnsfrMobltyMaxActyScore":  res.trnsfrMobltyMaxActyScore,
        "eatingMaxActyScore":  res.eatingMaxActyScore,
        "toilMaxActyScore": res.toilMaxActyScore,
        "orientMaxActyScore": res.orientMaxActyScore,
        "commMaxActyScore": res.commMaxActyScore,
        "medMaxActyScore": res.medMaxActyScore,
        "behavrlMaxActyScore": res.behavrlMaxActyScore,
        "totalAssessedActyScore": res.totalAssessedActyScore
    }
    return payLoad
  }


}
