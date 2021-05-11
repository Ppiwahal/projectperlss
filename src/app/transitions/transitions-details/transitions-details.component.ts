import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ChangeManagementService } from 'src/app/core/services/change-management/change-management.service';
import { TransitionsDetailsService } from 'src/app/core/services/Transitions/transitions-details.service'

@Component({
  selector: 'app-transitions-details',
  templateUrl: './transitions-details.component.html',
  styleUrls: ['./transitions-details.component.scss']
})
export class TransitionsDetailsComponent implements OnInit {
  transitionForm: FormGroup;
  personIdDetail = '';
  personOptions: any[];
  dataExists = false;
  dataSource: MatTableDataSource<any>;
  personId = '';
  additionalSerachName: any;
  expandedElement;
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;
  @ViewChild('applicantNameInput', {static: true}) applicantNameInput: ElementRef;
  displayedColumns = [
    'paeId',
    'paeStatus',
    'enrollmentGrpCd',
    'lvlOfcare',
    'enrollmentStatusCd',
    'action'
  ];

  levelofCare = [{"name": "NF", "value":"NF LOC","activateSW":"Y"},
                  {"name": "RK", "value":"At Risk","activateSW":"Y"}];

  constructor(private fb:FormBuilder, 
    private changeManagementService: ChangeManagementService,
    private transitionDetails: TransitionsDetailsService) { }

  ngOnInit(): void {
    this.transitionForm = this.fb.group({
      personId: [''],
    })
  }

  ngAfterViewInit() {
    //this.dataSource2.paginator = this.paginator;
    this.getAllPersonDetails();
  }

  handleSelection(option) {
    const date = option.prsnDetail.dobDt;
    this.personId = 'Name: ' + option.prsnDetail.firstName + ' ' + option.prsnDetail.lastName + ', DOB: ' + date + ', SSN: '
    + option.prsnDetail.ssn + ', PersonId: ' + option.prsnDetail.prsnId;
    if (option.prsnDetail.cntyCd) {
      this.personId = this.personId + ', CountyCode: ' + option.prsnDetail.cntyCd;
    }
    this.personIdDetail = option.prsnDetail.prsnId;
    this.transitionForm.controls.personId.setValue(this.personId);
    this.additionalSerachName = option.prsnDetail.firstName;
  }
  
  
  getAllPersonDetails() {
    fromEvent(this.applicantNameInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 1)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.changeManagementService.getPersonDetails(text,this.entityId).subscribe((res) => {
        this.personOptions = []
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            this.personOptions.push({
              personIdDetail: personDetail.personIdDetail,
              prsnDetail: personDetail
            });
          });
        }
      });
    
    });
  }
  
  dateFormat(date) {
    const previousDate = new Date(date);
    const dobDate = String(previousDate.getDate()).padStart(2, '0');
    const dobMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
    const dobYear = previousDate.getFullYear();
    return dobMonth + '/' + dobDate + '/' + dobYear;
  }

  getFormData() {
    return this.transitionForm.controls;
  }

  selectPerson()
  {
    console.log("personId" + this.personIdDetail);
    this.transitionDetails.getpaeDetails(this.personIdDetail).subscribe((data)=> { 
      console.log(data);
      if(data !== ' ' || data !== 'null' || data !== 'undefined')
      {
        this.dataExists = true;
        this.dataSource = new MatTableDataSource(data);
      } else{
        this.dataExists = false;
      }
    });
  }
  

}
