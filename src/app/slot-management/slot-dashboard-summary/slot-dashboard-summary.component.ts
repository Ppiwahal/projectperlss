import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlotManagmentService } from './../services/slot-managment.service';

@Component({
  selector: 'app-slot-dashboard-summary',
  templateUrl: './slot-dashboard-summary.component.html',
  styleUrls: ['./slot-dashboard-summary.component.scss']
})
export class SlotDashboardSummaryComponent implements OnInit,  OnDestroy {
  public slotDetailDataValues: any;
  subscriptions$: any[] = [];
  public ECF5and6SlotRatio: any;
  public ECF5and6EnrolledRatio: any;
  public slotSummary: any;
  constructor(private router: Router, private slotManagmentService: SlotManagmentService) { }
  ngOnInit(): void {
    const slotSummaryDetails$ = this.slotManagmentService.getSlotSummaryDetails().subscribe(res => {
      this.slotSummary = res;

      this.ECF5and6SlotRatio = parseFloat((this.slotSummary.ecf5Slot / this.slotSummary.ecf6Slot).toString()).toFixed(2) + ':1';
      this.ECF5and6EnrolledRatio = parseFloat((this.slotSummary.ecf5Enrollled / this.slotSummary.ecf6Enrolled).toString()).toFixed(2) + ':1';

    });
    this.subscriptions$.push(slotSummaryDetails$);
  }
  onClickRC(mode: string) {
    this.router.navigate(['ltss/slotEnrollmentTargets', mode]);
  }
  ngOnDestroy(){
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }
   calculateRatio(num_1, num_2){
    for (let num = num_2; num > 1; num--) {
        if ((num_1 % num) == 0 && (num_2 % num) == 0) {
            num_1 = num_1 / num;
            num_2 = num_2 / num;
        }
    }
    let ratio = num_1 +':'+ num_2;
    return ratio;
}
}
