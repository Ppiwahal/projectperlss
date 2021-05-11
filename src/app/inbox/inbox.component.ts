import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AssignUserComponent} from './assign-user/assign-user.component';
import { InboxService } from './services/inbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {

  taskCount: number = 0;
  notificationCount: number = 0;
  isVisible = true;
  load: any;

  private unsubscribe = new Subject<void>();

  constructor(private matDialog: MatDialog, private inboxService: InboxService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inboxService.reloadInboxComponent$$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.isVisible = false;
      this.changeDetectorRef.detectChanges();
      this.isVisible = true;
    })
  }

  ngAfterViewInit() {
    this.load = true;
  }
  
  assignPopupDialog() {
    const dialogConfig =  new MatDialogConfig();
    dialogConfig.minWidth = '450px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'edit-profile-container';
    this.matDialog.open(AssignUserComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
