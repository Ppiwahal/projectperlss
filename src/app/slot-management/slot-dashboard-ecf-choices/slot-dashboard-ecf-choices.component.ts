import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SlotManagmentService } from './../services/slot-managment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SlotUpdatePopupComponent } from '../slot-update-popup/slot-update-popup.component';

@Component({
  selector: 'app-slot-dashboard-ecf-choices',
  templateUrl: './slot-dashboard-ecf-choices.component.html',
  styleUrls: ['./slot-dashboard-ecf-choices.component.scss']
})
export class SlotDashboardEcfChoicesComponent implements OnInit, OnDestroy {
  taskTableShowResult: boolean = false;
  public slotOCAndTIP: any;
  public ecfAC: any;
  public ecfRC: any;
  public ecfOthersRC: any;
  public ecfPG: any;
  subscriptions$: any[] = [];
  @Input() searchresults: any;

  constructor(private slotManagmentService: SlotManagmentService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    const ocandTipSubscription$ = this.slotManagmentService.getOCAndTIPDetails().subscribe(res => {
      this.slotOCAndTIP = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(ocandTipSubscription$);

    const ecfACSubscription$ = this.slotManagmentService.getECFACDetails().subscribe(res => {
      this.ecfAC = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(ecfACSubscription$);

    const ecfRCSubscription$ = this.slotManagmentService.getECFRCDetails().subscribe(res => {
      this.ecfRC = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(ecfRCSubscription$);

    const ecfOtherRCSubscription$ = this.slotManagmentService.getECFOtherRCDetails().subscribe(res => {
      this.ecfOthersRC = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(ecfOtherRCSubscription$);

    const ecfPGSubscription$ = this.slotManagmentService.getECFPGDetails().subscribe(res => {
      this.ecfPG = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(ecfPGSubscription$);


  }
  getSearchResultsBySltStatus(statusCD: string) {
    const searchResultsBySltStatus$ = this.slotManagmentService.getSearchResultsBySltStatus(statusCD).subscribe(res => {
      this.searchresults = res;

    });
    this.subscriptions$.push(searchResultsBySltStatus$);

  }
  onSubmit(slottype : string , slotcode :string ,slotValue) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '650px';
    dialogConfig.height = '700px';
    dialogConfig.data = {
      "slotType": slottype,
      "slotCode": slotcode,
      "slotValue": slotValue
    }
    dialogConfig.panelClass = 'dialog-container';
    this.matDialog.open(SlotUpdatePopupComponent, dialogConfig);
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
