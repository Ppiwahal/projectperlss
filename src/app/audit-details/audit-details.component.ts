import {Component, OnInit} from '@angular/core';
import {AuditDetailsService} from '../core/services/audit/audit-details.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-audit-details',
  templateUrl: './audit-details.component.html',
  styleUrls: ['./audit-details.component.scss']
})
export class AuditDetailsComponent implements OnInit {
  auditDetailsData: any;
  pageHeader: string;
  searchAuditDetailParentId: any;

  constructor(private auditDetailsService: AuditDetailsService,
              private router: Router) {
  }

  ngOnInit() {
    this.searchAuditDetailParentId = this.auditDetailsService.getAuditSearchParentId();
    if (this.searchAuditDetailParentId != null) {
      console.log(this.searchAuditDetailParentId);
      this.auditDetailsService.getAuditDetails(this.searchAuditDetailParentId).subscribe(
        data => {
          console.log('HTTP response', data);
          this.auditDetailsData = data;
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.'));
    } else {
      this.router.navigate(['/ltss/auditHistory']);
    }
  }
  setEntityType(entityType) {
    if (entityType.entityType === 'com.perlss.appeal.model.AplRqst') {
      this.pageHeader = 'Appeal Request';
    } else if (entityType.entityType === 'com.perlss.appeal.model.AplReviewDecision') {
      this.pageHeader = 'Appeal Review Decision';
    } else if (entityType.entityType === 'com.perlss.appeal.model.AplHrngDtl') {
      this.pageHeader = 'Appeal Hearing Detail';
    }
  }
}
