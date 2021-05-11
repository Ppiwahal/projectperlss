import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-notification-details',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss'],
})
export class NotificationDetailsComponent implements OnInit {
  notificationDetails: any = [];
  subscriptions$ = [];
  isCloseByXIcon = false;
  details: any;
  notifications: any[];
  notificationsCount: number;
  file: any;
  fileURL: any;
  selectedFileBLOB: any;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<NotificationDetailsComponent>,
    private notificationService: NotificationsService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    const notificationId = this.data.notification.id;
    if (notificationId) {
      const loadNotificationDetails = this.notificationService
        .getNotificationDetails(userId, notificationId)
        .subscribe((data) => {
          this.details = data;
          if (this.details && this.details.document && this.details.document.length) {
            this.file = this.details.document;
          }
        });
      this.subscriptions$.push(loadNotificationDetails);
    }
  }

  openDoc(file) {
    if (this.file.length) {
      console.log('file', this.file)
      const blob = this.base64ToBlob( this.file, 'application/pdf' );
      const url = URL.createObjectURL( blob );
      const pdfWindow = window.open("");
      pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>")
    }
  }
   base64ToBlob( base64, type = "application/octet-stream" ) {
    const binStr = atob( base64 );
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[ i ] = binStr.charCodeAt( i );
    }
    return new Blob( [ arr ], { type: type } );
  }

  closePopup() {
    this.isCloseByXIcon = true;
    this.matDialogRef.close(this.isCloseByXIcon);
  }
}


