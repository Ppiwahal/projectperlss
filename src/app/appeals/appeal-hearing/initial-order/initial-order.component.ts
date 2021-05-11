import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-initial-order',
  templateUrl: './initial-order.component.html',
  styleUrls: ['./initial-order.component.scss']
})
export class InitialOrderComponent implements OnInit {

  @Input() appealId: any;
  @Output() enableSave = new EventEmitter();
  @Output() isEnableReconsiderations = new EventEmitter();

  orderGrantingService = [];
  isShowHearingOrderDetails = false;

  constructor() { }

  ngOnInit() { }

  addInitialOrderDetails() {
    this.isShowHearingOrderDetails = !this.isShowHearingOrderDetails;
  }

  enableReconsiderations(event) {
    this.isEnableReconsiderations.emit(true);
  }

  saveSuccess(event) {
    this.enableSave.emit(true);
  }

}
