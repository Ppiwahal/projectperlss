import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { PersonReconciliationService } from '../../services/person-reconciliation.service';
import { ToastrService } from 'ngx-toastr';
import * as Constants from '../../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

export interface PeriodicElementforSecond {
  personId: number;
  name: string;
  dob: string;
  ssn: string;
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SearchResultsComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['personId','name','dob','ssn', 'matchType'];
  selectedPersonIds: string[] = [];
  selectedMatchCodes: string[] = [];
  dataSource;
  recordId: any;
  taskMasterId: any;
  paeId: any;
  refId: any;
  personId1: any;
  taskId: any;
  userId: any;
  @Input() searchRecipientRecords:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  expandedElement;
  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private personReconciliationService: PersonReconciliationService) { 
                const searchParamsBySession = sessionStorage.getItem('ACTIVE_SESSION_DATA');
                const deCryptedSearchParams = CryptoJS.AES.decrypt(searchParamsBySession, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
                const searchParamJson = JSON.parse(deCryptedSearchParams);
                console.log("searchParamJson", searchParamJson);
                if (searchParamJson) {
                  this.taskMasterId = searchParamJson.taskMasterId;
                  this.paeId = searchParamJson.paeId;
                  this.refId = searchParamJson.referralId;
                  this.personId1 = searchParamJson.personId;
                  this.taskId = searchParamJson.taskId;
                }
              }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['searchRecipientRecords']) {
      this.dataSource =  new MatTableDataSource(this.searchRecipientRecords);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    }
  }

  getAddress(address, addressType) {
    if(address.addresses && address.addresses.length > 0) {
      const matchedAddr = address.addresses.find(addr => addr.addrType === addressType);
      if(matchedAddr) {
        return matchedAddr.street1 + "," +"<br/>"+matchedAddr.city +"-"+matchedAddr.countyCode +","+"<br/>"+matchedAddr.zipCode;
      }
      return '---';
    }
    return '---';
  }


  applyFilter(event: Event) {
  }

  selectPerson(sourceRecipientId, matchCode) {
    this.selectedPersonIds.push(sourceRecipientId);
    this.selectedMatchCodes.push(matchCode);
  }

  initiateLink() {
    this.recordId = this.refId ? this.refId : this.paeId;
    let payload = {
      "adminDocVO": {
        "taskMasterId":  this.taskMasterId
        },
      "appealId": null,
      "assignedUserId":  null,
      "mergedPersonId":   null,
      "moduleCode": null,
      "paeId": this.paeId ? this.paeId : null,
      "personId":  this.personId1,
      "priorityCd": null,
      "referalId": this.refId ? this.refId : null,
      "taskDetailDesc": null,
      "transitionId": null,
      "dueDate" : null
     };

     this.personReconciliationService.createTask(payload).subscribe(res => {
      if(res.errorCode && res.errorCode.description) {
        this.toastr.error(res.errorCode.description);
      } else {
        this.toastr.success(res.successMsgDescription);
        const date = new Date();
        const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
        this.userId = JSON.parse(localStorageforLocal).userName;
        const closureDetaildesc = " A duplicate was discovered in the person match results for the applicant associated to " + this.recordId+ " on " + date + "by" + this.userId+ ". Once the link process is completed, a new task will be created for a reevaluation."
        this.personReconciliationService.updateTaskClosure(this.taskId, closureDetaildesc).subscribe(res => {
          if(res.errorCode && res.errorCode.description) {
            this.toastr.error(res.errorCode.description);
          } else {
            this.toastr.success(res.taskId+" - "+res.successMsgDescription);
          }

        },err => {
          this.toastr.error('Service Error!');
        })
      }
    }, err => {
      this.toastr.error('Service Error!');
    })
  }

  associateIndividuals() {
      if(this.paeId) {
      this.recordId = this.refId ? this.refId : this.paeId;
      let payload = {
        "personId": this.personId1,
        "paeId": this.paeId ? this.paeId : null
      };
      this.personReconciliationService.updatePAEWithPerson(payload).subscribe(res => {
        if(res.errorCode && res.errorCode.description) {
          this.toastr.error(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          const date = new Date();
          const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
          this.userId = JSON.parse(localStorageforLocal).userName;
          const closureDetaildesc = "The applicant associated to " + this.recordId+ " was found to be a match with " + this.personId1 + " on " +date+ "by" + this.userId + ". A link request has been initiated to complete this association."
          this.personReconciliationService.updateTaskClosure(this.taskId, closureDetaildesc).subscribe(res => {
            if(res.errorCode && res.errorCode.description) {
              this.toastr.error(res.errorCode.description);
            } else {
              this.toastr.success(res.taskId+" - "+res.successMsgDescription);
            }

          },err => {
            this.toastr.error('Service Error!');
          })
        }
      }, err => {
        this.toastr.error('Service Error!');
      })
    } else {
      this.recordId = this.refId ? this.refId : this.paeId;
      let payload = {
        "personId": this.personId1,
        "refId": this.refId ? this.refId : null
      };
      this.personReconciliationService.updateREFWithPerson(payload).subscribe(res => {
        if(res.errorCode && res.errorCode.description) {
          this.toastr.error(res.errorCode.description);
        } else {
          this.toastr.success(res.successMsgDescription);
          const date = new Date();
          const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
          this.userId = JSON.parse(localStorageforLocal).userName;
          const closureDetaildesc = "The applicant associated to " + this.recordId+ " was found to be a match with " + this.personId1 + " on " +date+ "by" + this.userId + ". A link request has been initiated to complete this association."
          this.personReconciliationService.updateTaskClosure(this.taskId, closureDetaildesc).subscribe(res => {
            if(res.errorCode && res.errorCode.description) {
              this.toastr.error(res.errorCode.description);
            } else {
              this.toastr.success(res.taskId+" - "+res.successMsgDescription);
            }

          },err => {
            this.toastr.error('Service Error!');
          })
        }
      }, err => {
        this.toastr.error('Service Error!');
      })
      
    }
  }


  newIndividual() {
    this.recordId = this.refId ? this.refId : this.paeId;
    let payload = {
      "personId": this.personId1,
      "paeId": this.paeId ? this.paeId : null,
      "refId": this.refId ? this.refId : null,
     };

     this.personReconciliationService.verifyNewIndividual(payload).subscribe(res => {
      if(res.errorCode && res.errorCode.description) {
        this.toastr.error(res.errorCode.description);
      } else {
        this.toastr.success(res.successMsgDescription);
        const date = new Date();
        const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
        this.userId = JSON.parse(localStorageforLocal).userName;
        const closureDetaildesc = "The applicant associated to " + this.recordId+ " was found to be a unique individual on " + date + " by " + this.userId+ ". The applicant will retain their previously assigned Person ID."
        this.personReconciliationService.updateTaskClosure(this.taskId, closureDetaildesc).subscribe(res => {
          if(res.errorCode && res.errorCode.description) {
            this.toastr.error(res.errorCode.description);
          } else {
            this.toastr.success(res.taskId+" - "+res.successMsgDescription);
          }

        },err => {
          this.toastr.error('Service Error!');
        })
      }
    }, err => {
      this.toastr.error('Service Error!');
    })
  }

}
