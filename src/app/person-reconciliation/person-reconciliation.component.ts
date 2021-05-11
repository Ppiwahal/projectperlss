import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-person-reconciliation',
  templateUrl: './person-reconciliation.component.html',
  styleUrls: ['./person-reconciliation.component.scss']
})
export class PersonReconciliationComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    sessionStorage.removeItem('ACTIVE_SESSION_DATA');
  }

}
