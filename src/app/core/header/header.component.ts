import { PersonSearchService } from './../services/personsSearch/person-search.service';
import { NotificationsService } from './../services/notifications/notifications.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WidgetsComponent } from '../widgets/global-link-menu/widgets.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { PersonSearchComponent } from '../widgets/person-search/person-search.component';
import { NotificationComponent } from '../widgets/notification/notification.component';
import { Subscription, Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { EnvService } from '../../_shared/utility/env.service';
import { ChangeManagementService } from '../services/change-management/change-management.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  notificationsCount: number = 0;
  notifications: any[];
  subscriptions$: any[] = [];
  personProfiles: any[];
  entityId: any;
  text:string;
  element:any
  extref: boolean = false;
  currentUrl:any;
  subscribed: Array<Subscription>;
  buildInformation: any;
  phaseInformation: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private personSearchService:PersonSearchService,
    private envService: EnvService,
    private changeManagementService: ChangeManagementService
   
  ) {
    this.extref = true;
    this.buildInformation = this.envService.getBuildInformation();
  }

  ngOnInit(){
    this.loadData();
    this.personSearchService.getUserProfilesByEntityId(this.entityId).subscribe(res => {
      this.personProfiles = res;
    });
    this.subscribed = new Array<Subscription>();
    this.extref = true;
    this.subscribed.push(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),startWith(this.router)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.currentUrl = (this.currentUrl.indexOf("?") > -1) ? this.currentUrl.substring(0,this.currentUrl.indexOf("?")) : this.currentUrl;
      if (this.currentUrl.indexOf("/externalreferral")>-1)  {
        this.extref = true;
      }else{
        this.extref = false;
      }
    }));
    // this.getAllPersonDetails();

    this.changeManagementService.getUserProfilesPhaseID().subscribe(res => {
      localStorage.setItem('PHASE', JSON.stringify(res));
    });
    this.phaseInformation = JSON.parse(localStorage.getItem('PHASE'));

  }

  loadData() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    this.entityId = JSON.parse(localStorageLocal).entityId;
    const loadAllNotifications = this.notificationService
      .getNotifications(userId)
      .subscribe((data) => {
        this.notifications = data;
        if (this.notifications && this.notifications.length) {
          this.notificationsCount = this.notifications.length;
        }
      });
    this.subscriptions$.push(loadAllNotifications);
  }

  openDialog() {
    const dialogRef = this.dialog.open(WidgetsComponent, {
      width: 'auto',
      height: 'auto',
      position: {
        top: '200px',
        right: '40px',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPersonSearchDialog(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { personProfiles: this.personProfiles};
    // dialogConfig.data = { route: 'ltss/pae' , nextRoute: '/ltss/pae/paeStart/' + this.nextPath };
    dialogConfig.panelClass = 'exp_popup';
    dialogConfig.width = '65vw';
    dialogConfig.height = '65vw';
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(PersonSearchComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.data) {
        this.personSearchService.getPersonDetails(this.text, this.entityId).subscribe(res => {
        })
      }
    })

  }
  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
  }


  logout() {
    this.authenticationService.logout();
  }

  showError() {
    this.router.navigate(['/error']);
  }
  openNotificationPopup() {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '320px',
      height: '400',
      panelClass: 'notificaition-dialog',
      position: {
        top: '180x',
        right: '100px',
      },
      data: { notifications: this.notifications },
    });
    dialogRef.afterOpened().subscribe((event) => {
      console.log('events', event);
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.notificationsCount = null;
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
    if (this.subscribed && this.subscribed.length > 0) {
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
    }

  }

  logo() {
    this.router.navigate(['/ltss/home']);
  }
}
