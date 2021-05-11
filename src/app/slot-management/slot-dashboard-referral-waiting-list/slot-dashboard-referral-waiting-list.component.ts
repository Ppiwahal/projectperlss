import { Component, OnDestroy, OnInit } from '@angular/core';
import { SlotManagmentService } from './../services/slot-managment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EcfChoicesReferralListPopupComponent } from '../ecf-choices-referral-list-popup/ecf-choices-referral-list-popup.component';
import { KatieBeckettPartAPopupComponent } from '../katie-beckett-part-a-popup/katie-beckett-part-a-popup.component';
import { KatieBeckettPartBPopupComponent } from '../katie-beckett-part-b-popup/katie-beckett-part-b-popup.component';
import { Choices2PopupComponent } from '../choices2-popup/choices2-popup.component';

@Component({
  selector: 'app-slot-dashboard-referral-waiting-list',
  templateUrl: './slot-dashboard-referral-waiting-list.component.html',
  styleUrls: ['./slot-dashboard-referral-waiting-list.component.scss']
})
export class SlotDashboardReferralWaitingListComponent implements OnInit, OnDestroy {
  public slotReferralList: any;
  subscriptions$: any[] = [];

  constructor(private slotManagmentService: SlotManagmentService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    const referralWaitingList$ = this.slotManagmentService.getReferralAndWaitingListCount().subscribe(res => {
      this.slotReferralList = res;
    });
    this.subscriptions$.push(referralWaitingList$);

  }
  Onclick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '650px';
    dialogConfig.height = '700px';
    dialogConfig.panelClass = 'dialog-container';
    this.matDialog.open(EcfChoicesReferralListPopupComponent, dialogConfig);
  }
  OnclickKatiePartA() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '1000px';
    dialogConfig.height = '850px';
    dialogConfig.panelClass = 'dialog-container';
    this.matDialog.open(KatieBeckettPartAPopupComponent, dialogConfig);

  }
  OnclickKatiePartB() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '1000px';
    dialogConfig.height = '850px';
    dialogConfig.panelClass = 'dialog-container';
    this.matDialog.open(KatieBeckettPartBPopupComponent, dialogConfig);

  }
  OnclickChoices(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '1000px';
    dialogConfig.height = '700px';
    dialogConfig.panelClass = 'dialog-container';
    this.matDialog.open(Choices2PopupComponent, dialogConfig);
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
