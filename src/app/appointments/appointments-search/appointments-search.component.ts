import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentsService } from '../services/appointments.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CancelAppointmentComponent } from "../cancel-appointment/cancel-appointment.component";
import * as customValidation from '../../_shared/constants/validation.constants';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StaticDataMapService } from '../../core/helpers/static.data.map.service';


@Component({
  selector: 'app-appointments-search',
  templateUrl: './appointments-search.component.html',
  styleUrls: ['./appointments-search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AppointmentsSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  myForm: FormGroup;
  searchForm: FormGroup;
  displayedColumns: string[] = ['name', 'ssn', 'referralId', 'paeId', 'appointmentType', 'appointmentStatus', 'appointmentDate'];
  dataSource: MatTableDataSource<any>;
  expandedElement;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data = [];
  subscriptions$: any[] = [];
  appointmentTypes: any[];
  contactMethodDetails: any[];
  reasonCodes: any[];
  appointmentDetails: any[];
  selectedPersonId: number;
  space = " ";
  customValidation = customValidation;
  showNoRecordsFound: boolean;
  @ViewChild('applicantNameInput', { static: true }) applicantNameInput: ElementRef;
  personOptions: any[] = [];
  localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
  userId = JSON.parse(this.localStorageLocal).userName;
  entityId = JSON.parse(this.localStorageLocal).entityId;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentsService,
    private matDialog: MatDialog,
    private staticDataService: StaticDataMapService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.myForm = this.fb.group({
      personId: [''],
      contactMethod: [''],
      status: [''],
      type: [''],
      refId: [''],
      paeId: ['']
    });
    if (window.history.state && window.history.state['data']) {
      this.data = window.history.state['data'];
    }
    this.getAppointmentTypeDetails();
    this.getContactMethodDetails();
    this.getappointmentStatusDetails();
    this.getAllPersonDetails();
  }

  getAppointmentTypeDetails() {
    const appointmentTypeDetails$ = this.appointmentService.getAppointmentType().subscribe(res => {
      this.appointmentTypes = res;
    });
    this.subscriptions$.push(appointmentTypeDetails$);
  }

  getAppointmentType(typeCode) {
    if (typeCode && this.appointmentTypes && this.appointmentTypes.length > 0) {
      const matchedAppointmentType = this.appointmentTypes.filter(appointmentType => appointmentType.code === typeCode);
      if (matchedAppointmentType && matchedAppointmentType.length > 0) {
        return matchedAppointmentType[0].value;
      } else {
        return '';
      }
    }
    return '';
  }

  getAppointmentStatus(statusCode) {
    if (statusCode && this.appointmentDetails && this.appointmentDetails.length > 0) {
      const matchedAppointmentStatus = this.appointmentDetails.filter(appointmentStatus => appointmentStatus.code === statusCode);
      if (matchedAppointmentStatus && matchedAppointmentStatus.length > 0) {
        return matchedAppointmentStatus[0].value;
      } else {
        return '';
      }
    }
    return '';
  }

  getContactMethod(contactMethod) {
    if (contactMethod && this.contactMethodDetails && this.contactMethodDetails.length > 0) {
      const matchedContactMethod = this.contactMethodDetails.filter(contactMethodVal => contactMethodVal.code === contactMethod);
      if (matchedContactMethod && matchedContactMethod.length > 0) {
        return matchedContactMethod[0].value;
      } else {
        return '';
      }
    }
    return '';
  }

  getContactMethodDetails() {
    const contactTypeMethod$ = this.appointmentService.getContactMethod().subscribe(res => {
      this.contactMethodDetails = res;
    });
    this.subscriptions$.push(contactTypeMethod$);
  }

  getappointmentStatusDetails() {
    const appointmentStatusDetails$ = this.appointmentService.getCancellationReasonCodes().subscribe(res => {
      this.appointmentDetails = res;
    });
    this.subscriptions$.push(appointmentStatusDetails$);
  }

  getCancellationReasonCode() {

    return this.appointmentService.getCancellationReasonCodes().toPromise();

  }

  getCountyName(personCountycd) {
    const countyCds = this.staticDataService.getStaticDataKeyValue('COUNTY');
    const filterCountyCds = countyCds.filter(item => item.code === personCountycd);
    return filterCountyCds.length > 0 ? filterCountyCds[0].value : ' ';
  }

  handleSelection(option) {
    const personDisplayName = "Applicant Name: " + option.prsnDetail.firstName + " " + option.prsnDetail.lastName + ", Date of Birth: " + option.prsnDetail.dobDt + ", SSN: " + option.prsnDetail.ssn + ", Person ID: " + option.prsnDetail.prsnId + ", County: " + option.prsnDetail.prsnCountyName;
    this.myForm.controls['personId'].setValue(personDisplayName);
    this.selectedPersonId = option.prsnDetail.prsnId;
    console.log("selectedPersonId ", this.selectedPersonId);
  }

  get f() {
    return this.myForm.controls;
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
      this.appointmentService.getPersonDetails(text, this.entityId).subscribe((res: any) => {
        this.personOptions = [];
        if (res && res.length > 0) {
          res.forEach(personDetail => {
            const prsnCountyName = this.getCountyName(personDetail.cntyCd);
            personDetail = { ...personDetail, ...{ prsnCountyName } };
            this.personOptions.push({
              personId: personDetail.prsnId,
              prsnDetail: personDetail
            })
          })
        } else {
          this.toastr.error(res.errorCode[0].description);
        }
        console.log("res ", res);
      }, (err) => {
        console.log('error', err);
      });

    });
  }

  ngAfterViewInit() {
    if (this.data && this.data.length > 0) {
      this.dataSource = new MatTableDataSource(this.data);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      //this.showNoRecordsFound = false;
    }
  }

  showCancelDialog(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.data = { appointmentId: row.appointmentId || row.id };
    this.matDialog.open(CancelAppointmentComponent, dialogConfig);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async executeSearch() {
    try {
      this.reasonCodes = await this.getCancellationReasonCode();
      const formValues = this.myForm.value;
      if (formValues["personId"]) {
        formValues["personId"] = this.selectedPersonId
      }
      let data;
      let isSearchAll = false;
      let queryString = '';
      Object.keys(formValues).forEach((element) => {
        if (formValues[`${element}`]) {
          queryString !== '' ? queryString = `${queryString}&${element}=${formValues[`${element}`]}` : queryString = `?${element}=${formValues[`${element}`]}`;
        }
      });
      if (queryString) {
        data = await this.appointmentService.searchAppointment(queryString);
        if (data.body.length === 0) {
          this.showNoRecordsFound = true;
        } else {
          this.showNoRecordsFound = false;
        }
      } else {
        data = await this.appointmentService.searchAllAppointments();
        isSearchAll = true;
      }

      if (data['status'] === 200) {
        if (data.body.length === 0) {
          this.showNoRecordsFound = true;
        } else {
          this.showNoRecordsFound = false;
        }
        this.data = data['body'];
        console.log("reasonCodes ", this.reasonCodes);
        this.data.forEach(row => {
          if (isSearchAll) {
            row['personName'] = row['firstName'] + " " + row['lastName'];
            row['appointmentTypeCd'] = row['appTypeCd'];
            row['appointmentStatusCd'] = row['appStatusCd'];
            row['appointmentDate'] = row['appDt'];
            row['personId'] = row['prsnId'];
            row['contactUser'] = row['cntctUser'];
            row['contactGroup'] = row['cntctMethodCd'];
          }
          const matchedAppTypeCode = this.appointmentTypes.filter(codeObj => codeObj.code === row.appointmentTypeCd);
          if (matchedAppTypeCode && matchedAppTypeCode.length > 0) {
            row['appointmentType'] = matchedAppTypeCode[0].value;
          }
          const matchedStatusCode = this.appointmentDetails.filter(codeObj => codeObj.code === row.appointmentStatusCd);
          if (matchedStatusCode && matchedStatusCode.length > 0) {
            row['appointmentStatus'] = matchedStatusCode[0].value;
          }
          const matchedContactMethod = this.contactMethodDetails.filter(codeObj => codeObj.code === row.cntctMethodCd);
          if (matchedContactMethod && matchedContactMethod.length > 0) {
            row['contactMethod'] = matchedContactMethod[0].value;
          }
        })

        this.dataSource = new MatTableDataSource(this.data);
        setTimeout(() => this.dataSource.paginator = this.paginator);

      }
    } catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
