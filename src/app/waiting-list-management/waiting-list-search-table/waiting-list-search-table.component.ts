import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {WaitingListService} from "../services/waiting-list.service";
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-waiting-list-search-table',
  templateUrl: './waiting-list-search-table.component.html',
  styleUrls: ['./waiting-list-search-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WaitingListSearchTableComponent implements OnInit, OnChanges {

  dataSource = [];
  displayedColumns = ['personName', 'ssn', 'age', 'referralId','programType', 'lOCReassessmentDueDate'];
  expandedElement: any | null;
  @Input() searchResults:any[];

  constructor(private waitingListService: WaitingListService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.searchResults) {

      this.waitingListService.getTaskStatusValues().subscribe((res: any) => {
        let finalresults = [];
        this.searchResults.forEach(result => {
          if(result["taskDetails"] && result["taskDetails"].length > 0 ) {
            const matchedStatusCode = res.filter(taskStatus => (taskStatus.code === result["taskDetails"][0]['taskStatus']));
            if (matchedStatusCode && matchedStatusCode.length > 0) {
              result["taskDetails"][0]['taskStatus'] = matchedStatusCode[0].value;
            } else {
              result["taskDetails"][0]['taskStatus'] = '';
            }
          }
          result['waitingListStatus'] = (result['waitingListStatus'] === 'N') ? 'Inactive':  (result['waitingListStatus'] === 'Y') ? 'Active' : '';
          if (this.isObjectNotNull(result)) {
            finalresults.push(result);
          }
        });
        this.dataSource = finalresults;
      })
    }
  }

  isObjectNotNull(result) {
    const keys =  Object.keys(result);
    let isNotNull = false;
    keys.forEach(key => {
      if(result[key] !== null) {
        isNotNull = true;
      }
    });
    return isNotNull;
   }

}
