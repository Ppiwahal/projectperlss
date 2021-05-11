import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaeCommonService } from 'src/app/core/services/pae/pae-common/pae-common.service';
import { SavePopupComponent } from 'src/app/savePopup/savePopup.component';
import { PaeSkilledServicesDetailsService } from 'src/app/core/services/pae/pae-skilled-services/pae-skilled-services-details.service'
import { Subscription } from 'rxjs';
import { PaeService } from 'src/app/core/services/pae/pae.service';

@Component({
  selector: 'app-pae-skilled-services-details-kb',
  templateUrl: './pae-skilled-services-details-kb.component.html',
  styleUrls: ['./pae-skilled-services-details-kb.component.scss'],
})
export class PaeSkilledServicesDetailsKbComponent implements OnInit, OnDestroy {
  frequencyList = [
    { code: 'MOR', value: '8 or more hours per day', activateSW: 'Y' },
    { code: 'LES', value: 'Less than 8 hours per day', activateSW: 'Y' },
  ];

  SKILLEDSERVICE_NAME_NONKB = 
  [{"code":"WCS","value":"Wound Care for Stage 3 or 4 Decubitus","activateSW":"Y"},
  {"code":"OWC","value":"Other Wound Care (i.e., infected or dehisced wounds)","activateSW":"Y"},
  {"code":"ISS","value":"Injections, sliding scale insulin","activateSW":"Y"},
  {"code":"IOT","value":"Injections, other: IV, IM","activateSW":"Y"},
  {"code":"INT","value":"Intravenous fluid administration","activateSW":"Y"},
  {"code":"ISP","value":"Isolation precautions","activateSW":"Y"},
  {"code":"OCT","value":"Occupational Therapy by OT or OT assistant","activateSW":"Y"},
  {"code":"PHT","value":"Physical Therapy by PT or PT assistant","activateSW":"Y"},
  {"code":"TCO","value":"Teaching Catheter/Ostomy care","activateSW":"Y"},
  {"code":"TSI","value":"Teaching self-injection","activateSW":"Y"},
  {"code":"TPN","value":"Total Parenteral nutrition","activateSW":"Y"},
  {"code":"TFE","value":"Tube feeding, enteral","activateSW":"Y"},
  {"code":"PED","value":"Peritoneal Dialysis","activateSW":"Y"},
  {"code":"PCA","value":"PCA Pump","activateSW":"Y"},
  {"code":"TRS","value":"Tracheostomy requiring suctioning","activateSW":"Y"},
  {"code":"VNT","value":"Ventilator","activateSW":"Y"},
  {"code":"CVS","value":"Chronic Ventilator Service ","activateSW":"Y"},
  {"code":"SMT","value":"Secretion Management Tracheal Suctioning ","activateSW":"Y"}];

  frequencyMap = new Map();
  sectionType: FormGroup;
  submitted = false;
  paeId = '';
  sectionTypeDataExists = false;
  subscription1$: Subscription;
  reqPageId = 'PPSSD';

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private paeCommonService: PaeCommonService,
    private paeService:PaeService,
    private paeSkilledServiceDetails: PaeSkilledServicesDetailsService
  ) {}

  ngOnInit() {
    this.sectionType = this.fb.group({
      sectionTypeCd: [null],
      rqstdEndDt: [null, [Validators.required]],
      rqstdStartDt: [null, [Validators.required]],
      frqcy12monSw: [null],
      frqcyCd: [null],
      serviceRequiredSw: [null],
    });
  }

  getsectionTypeFormData() {
    return this.sectionType.controls;
  }
  saveAndExit() {
    if (this.submitted) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = { route: 'ltss/pae' };
      dialogConfig.panelClass = 'exp_popup';
      dialogConfig.width = '648px';
    dialogConfig.height = '360px';

      this.dialog.open(SavePopupComponent, dialogConfig );
    }
  }

  openedAccordion(accordionName) {
    
    this.paeSkilledServiceDetails
    .postSkilledDetails({...this.sectionType.value, paeId: this.paeId})
    .then((response)=>{
      console.log('response', response);
    this.sectionTypeDataExists = true;
  }, err => {
    console.log('error');
  });
  }
  back(){
    this.paeService.navigateToChildPreviousPage(this.reqPageId);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Unsubscribed');
  }
}
