import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditAssessorPopupComponent } from '../edit-assessor-popup/edit-assessor-popup.component';
import * as customValidation from '../../_shared/constants/validation.constants';
import { QualifiedAssessorService } from '../service/qualified-assessor.service';
@Component({
  selector: 'app-search-assessor-result',
  templateUrl: './search-assessor-result.component.html',
  styleUrls: ['./search-assessor-result.component.scss']
})
export class SearchAssessorResultComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() assessorsTableData = [];
  @Input() entityData: any;
  @Input() statusData: any;
  @Input() credentialData: any;
  @Input() payloadData: any;
  customValidation = customValidation;
  @Input() showNoRecordsFound: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscriptions$ = [];

  displayedColumns: string[] = ['assessorId', 'programCd', 'credentialsCd', 'name', 'endDt', 'entityId', 'statusCd', 'symbol'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.assessorsTableData);
  showTable = false;

  constructor(private matDialog: MatDialog, private qualifiedAssessorService: QualifiedAssessorService) { }

  ngOnInit() { }

  ngOnChanges() {
    this.loadTableData();
  }

  getNameByCode(code: string, entity: string) {
    if (entity === 'AT' && code) {
      const result = this.credentialData.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
    if (entity === 'SC' && code) {
      const result = this.statusData.filter(item => item.code === code);
      return result.length > 0 ? result[0].value : code;
    }
  }
  loadTableData() {
    if (this.assessorsTableData.length > 0) {
      this.showTable = true;
      this.assessorsTableData.forEach(data => {
        // this.statusData.forEach(ele => {
        //   if (data.statusCd === ele.code) {
        //     data.statusCd = ele.value;
        //   }
        // });
        // this.credentialData.forEach(ele => {
        //   if (data.credentialsCd === ele.code) {
        //     data.credentialsCd = ele.value;
        //   }
        // });
        this.entityData.forEach(ele => {
          if (data.entityId === ele.entityId) {
            data.entityId = ele.entityName;
          }
        });
      });
      this.dataSource = new MatTableDataSource(this.assessorsTableData);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.showNoRecordsFound = false;
    } else {
      this.showTable = false;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAssessorEditPopup(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.height = '90vh';
    dialogConfig.data = {
      assessorData: element,
      entityDropDownData: this.entityData,
      statusData: this.statusData,
      credentialData: this.credentialData
    };
    const dialogRef = this.matDialog.open(EditAssessorPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.dataSource = new MatTableDataSource([]);
        this.getAssessorData();
      }
    });
  }

  getAssessorData() {
    this.showTable = false;
    const getAssessorData$ = this.qualifiedAssessorService.getAssessorData(this.payloadData).subscribe(res => {
      if (res.length === 0) {
        this.showNoRecordsFound = true;
      } else {
        res.forEach(data => {
          this.statusData.forEach(ele => {
            if (data.statusCd === ele.code) {
              data.statusCd = ele.value;
            }
          });
          this.credentialData.forEach(ele => {
            if (data.credentialsCd === ele.code) {
              data.credentialsCd = ele.value;
            }
          });
          this.entityData.forEach(ele => {
            if (data.entityId === ele.entityId) {
              data.entityId = ele.entityName;
            }
          });
        });
        this.dataSource = new MatTableDataSource(res);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.showNoRecordsFound = false;
        this.showTable = true;
      }
    });
    this.subscriptions$.push(getAssessorData$);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
