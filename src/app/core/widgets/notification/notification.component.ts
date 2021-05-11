import { NotificationDetailsComponent } from './notification-details.component';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  Inject,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NotificationsService } from '../../services/notifications/notifications.service';
@Component({
  selector: 'app-notification',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  subscriptions$ = [];
  notifications: any = [];
  clicked: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<NotificationComponent>,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {}
  closePopup() {
    this.matDialogRef.close();
  }

  notificationDetailsPopUp(notification: any) {
    const dialoagRef: MatDialogRef<NotificationDetailsComponent> = this.dialog.open(
      NotificationDetailsComponent,
      {
        width: '700px',
        height: '600px',
        panelClass: 'notification-details-container',
        data: { notification },
      }
    );
    dialoagRef.afterClosed().subscribe((isCloseByXIcon: boolean) => {
      if (!isCloseByXIcon || isCloseByXIcon === undefined) {
        console.log(
          'isCloseByXIcon is',
          isCloseByXIcon + ' ' + 'Closing the parent dialog as'
        );
        this.matDialogRef.close();
      }
    });
    this.clicked = !this.clicked;
  }
  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach((subscription$) =>
        subscription$.unsubscribe()
      );
    }
  }
}
