import { Component, OnDestroy, OnInit } from '@angular/core';
import { SlotManagmentService } from './../services/slot-managment.service';

@Component({
  selector: 'app-slot-dashboard-katie-beckett',
  templateUrl: './slot-dashboard-katie-beckett.component.html',
  styleUrls: ['./slot-dashboard-katie-beckett.component.scss']
})
export class SlotDashboardKatieBeckettComponent implements OnInit, OnDestroy {
  taskTableShowResult: boolean = false;
  public slotKBDetails: any;
  subscriptions$:any[] = [];

  constructor(private slotManagmentService: SlotManagmentService) { }

  ngOnInit(): void {
    const kbDetails$= this.slotManagmentService.getKBDetails().subscribe(res => {
      this.slotKBDetails = res;
    });
    this.taskTableShowResult = true;
    this.subscriptions$.push(kbDetails$);

  }
  ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }

}
