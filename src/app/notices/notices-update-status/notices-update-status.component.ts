import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {NoticesService} from '../services/notices.service';
import * as customValidation from '../../_shared/constants/validation.constants';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-notices-update-status',
  templateUrl: './notices-update-status.component.html',
  styleUrls: ['./notices-update-status.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NoticesUpdateStatusComponent implements OnInit {
  noticeForm: FormGroup;
  noticeStatus: any;
  customValidation = customValidation;
  @Input() corId;
  @Output() reloadData = new EventEmitter<any>();
  userId: any;

  constructor(private toastr: ToastrService, private fb: FormBuilder, private noticeService: NoticesService) { }

  ngOnInit(): void {
    this.noticeForm = this.fb.group({
      noticeStatus: ['', Validators.required],
      reasonForChange:['']
    });
    this.noticeStatus = [ {name: "PE", value: "Pending", activateSW: "Y"},
    {name: "RP", value: "Reprint", activateSW: "Y"},
    {name: "SU", value: "Suppressed", activateSW: "Y"}
    ];
  }

  get f() {
    return this.noticeForm.controls;
  }

  search(): void {
   if(this.noticeForm.valid) {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    const payload = {...{corId: this.corId}, ...{userId: this.userId}, ...this.noticeForm.value};
    this.noticeService.updateNoticeStatus(payload).subscribe(res => {
      if(res.successMessage) {
        this.toastr.success(res.successMessage);
        this.noticeForm.reset();
        this.reloadData.emit();
      } else if(res.errorCode && res.errorCode.length > 0) {
        this.toastr.error(res.errorCode[0].description);
      }
    }, (error) => {
      this.toastr.error("Internal Server Error!");
    });
  }
}

}
