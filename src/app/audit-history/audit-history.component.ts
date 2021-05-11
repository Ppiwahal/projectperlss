import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuditHistory} from '../_shared/model/AuditHistory';
import {AuditHistoryService} from '../core/services/audit/audit-history.service';
import {AuditDetailsService} from '../core/services/audit/audit-details.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.scss']
})
export class AuditHistoryComponent implements OnInit {
  auditSearch: string[] = ['userid', 'pageid', 'personid', 'paeid', 'referralid', 'appealid', 'details'];
  isSearchClicked = false;
  myForm: FormGroup;
  range: FormGroup;
  dataSource: MatTableDataSource<any>;

  constructor(private fb: FormBuilder,
              private router: Router,
              private auditHistoryService: AuditHistoryService,
              private auditDetailService: AuditDetailsService) {
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      appealid: [''],
      paeid: [''],
      personid: [''],
      pageid: [''],
      referralid: [''],
      userid: [''],
      modifiedFromDate: [''],
      modifiedToDate: ['']
    });
  }

  getDateRangeForm() {
    return this.myForm.controls;
  }

  displayTableToggle() {
    this.isSearchClicked = true;
    let modifiedFromDate = JSON.stringify(this.getDateRangeForm().modifiedFromDate.value);
    let modifiedToDate = JSON.stringify(this.getDateRangeForm().modifiedToDate.value);
    modifiedFromDate = modifiedFromDate.replace(/['"]+/g, '');
    modifiedToDate = modifiedToDate.replace(/['"]+/g, '');
    const auditSearchparameters = new AuditHistory(this.getDateRangeForm().appealid.value,
      this.getDateRangeForm().referralid.value,
      this.getDateRangeForm().paeid.value,
      this.getDateRangeForm().userid.value,
      this.getDateRangeForm().personid.value,
      this.getDateRangeForm().pageid.value,
      modifiedFromDate,
      modifiedToDate);
    this.auditHistoryService.searchAuditHistory(auditSearchparameters).subscribe(
      res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
      },
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.'));

  }

  selectAuditRow(row: any) {
    this.auditDetailService.setAuditSearchParentId(row.parentId);
    this.router.navigate(['/ltss/auditDetails']);
  }
}
