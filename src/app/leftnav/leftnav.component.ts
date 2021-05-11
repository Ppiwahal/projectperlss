import { LoaderService } from './../loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Router } from '@angular/router';
import { RoutingService } from '../core/services/routing/routing-service.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { PageAccessUtil } from '../_shared/utility/PageAccessUtil';

@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.scss'],
})

export class LeftnavComponent implements OnInit, OnDestroy {

  isSideNavToggled = true;
  isSideNavToggledWait = true;
  isLoginPage = true;
  pageId: string;
  pageHeader: string;
  complexPageHeader: any;
  userInitials: any;
  currentUser: User;
  userFontSize = '22px';
  currentMenuItem = null;
  currentMenuParent = null;
  nullValue = null;
  pageError = null;
  menuById = null;
  parentPageId = null;
  showRequired = false;
  waiting = false;
  subscribed: Array<Subscription> = [];
  fNameInitial: any;
  lNameInitial: any;
  fName: any;
  lName: any;
  phaseInfo: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private routingService: RoutingService,
    public loaderService: LoaderService
  ) {
    this.phaseInfo = JSON.parse(localStorage.getItem('PHASE'));
    const evaluatedBusinessIds = [];
    if (this.menuById == null) {
      this.menuById = {};
      for (let i = 0; i < this.menuData.length; i++) {
        const menuItem = this.menuData[i];
        const hasMenuAccess = PageAccessUtil.hasUserAccessToPage(menuItem.businessFunctionId);
        menuItem.hidden = !hasMenuAccess;
        this.menuById[menuItem.id] = menuItem;
        if (hasMenuAccess && menuItem.children) {
          for (let j = 0; j < menuItem.children.length; j++) {
            const subMenuItem = menuItem.children[j];
            if(evaluatedBusinessIds.indexOf(subMenuItem.businessFunctionId) === -1) {
              const hasPageAccess = PageAccessUtil.hasUserAccessToPage(subMenuItem.businessFunctionId);
              subMenuItem.hidden = hasPageAccess ? false : true;
               if(subMenuItem.dependentBusinessFunctionIds) {
                  subMenuItem.dependentBusinessFunctionIds.forEach(dependentBusinessFunctionId => {
                    evaluatedBusinessIds.push(dependentBusinessFunctionId);
                    const matchedDependent =  menuItem.children.find(child => child.businessFunctionId === dependentBusinessFunctionId);
                    if(matchedDependent) {
                      matchedDependent.hidden = hasPageAccess ? false : true;
                    }
                  });
                }
            }
            subMenuItem.parentId = menuItem.id;
            this.menuById[subMenuItem.id] = subMenuItem;
            if (subMenuItem.children) {
              for (let k = 0; k < subMenuItem.children.length; k++) {
                const ssMenuItem = subMenuItem.children[k];
                ssMenuItem.parentId = subMenuItem.id;
                this.menuById[ssMenuItem.id] = ssMenuItem;
              }
            }
          }
        }
      }
    }

    this.subscribed.push(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));

    this.subscribed.push(this.routingService.pageId$.subscribe(pageId => {
      pageId = (pageId.indexOf("?") > -1) ? pageId.substring(0, pageId.indexOf("?")) : pageId;
      this.pageId = pageId;
      this.setPageHeader();
      window.scrollTo(0, 0);
    }));

    this.subscribed.push(this.routingService.waiting$.subscribe(waiting => {
      this.waiting = waiting;
    }));

    this.subscribed.push(this.routingService.errorMessage$.subscribe(errorMessage => {
      this.pageError = errorMessage;
      this.pageHeader = 'Navigation Error';
    }));

    this.pageId = routingService.getCurrentPageId();
    this.setPageHeader();

  }

  menuData: Array<any> = [{
    text: 'MAIN', id: 'main', open: true, children: [
      { id: 'home', icon: 'home', text: 'Home', phase:['P1', 'P2', 'P3'] },
      { id: 'inbox', icon: 'assignment_turned_in', text: 'Inbox', phase:['P1', 'P2', 'P3'] },
      {
        id: 'referral', icon: 'person_add', text: 'Referral', phase:['P1', 'P2', 'P3'], children: [
          { id: 'referralDashboard', text: 'Referral', isRoute: true, showRequired: true },
          { id: 'startReferral', text: 'Referral / New ECF Referral', isRoute: true, showRequired: true },
          { id: 'referralIntakeActions', text: 'Referral / Intake Actions', isRoute: true, showRequired: true },
          { id: 'referralIntakeOutcome', text: 'Referral / Intake Actions / Intake Outcome', isRoute: true, showRequired: true }
        ]
      },

      {
        id: 'appointments', icon: 'event_available', text: 'Appointments', phase:['P1', 'P2', 'P3'], children: [
          { text: 'Appointments / Search or Add Appointment', hybridText: [{ text: 'Appointments', routeTo: 'appointments' }, { text: 'Search or Add Appointment' }], id: 'search', isRoute: true }
        ]
      },
      { id: 'pae', icon: 'content_paste', text: 'PAE', phase:['P1', 'P2', 'P3'] },
      {
        id: 'documents', icon: 'folder_open', text: 'Document', phase:['P1', 'P2', 'P3'], children: [
          { text: 'Document / View Document', hybridText: [{ text: 'Document', routeTo: 'documents' }, { text: 'View Document' }], id: 'history', isRoute: true },
          { text: 'Document / View Document / Reassign Document', hybridText: [{ text: 'Document', routeTo: 'documents' }, { text: 'View Document', routeTo: 'documents/history' }, { text: 'Reassign Document' }], id: 'reassign-document', isRoute: true },
        ]
      },
      {
        id: 'notices', icon: 'mail_outline', text: 'Notices', phase:['P1', 'P2', 'P3'], children: [
          { text: 'Notices', id: 'noticesDashboard', isRoute: true },
          { text: 'Notices / Notices Details', id: 'details', isRoute: true },
          { text: 'Notices / Create Manual Notice', hybridText: [{ text: 'Notices', routeTo: 'notices' }, { text: 'Create Manual Notice' }], id: 'createmanualnotice', isRoute: true },
          { text: 'Notices / Return Mail', hybridText: [{ text: 'Notices', routeTo: 'notices' }, { text: 'Return Mail' }], id: 'returnnoticemail', isRoute: true }
        ]
      },
      { id: 'transitions', icon: 'swap_horiz', text: 'Transitions', phase:['P1', 'P2', 'P3'], children: [
        { text: 'Transitions / Transition Details', id: 'transitionsDetails', isRoute: true }] },
      {
        id: 'changeManagement', icon: 'settings', text: 'Change Management', phase:['P1', 'P2', 'P3'], children: [
          { text: 'Change Management', id: 'dashboard', isRoute: true },
          { text: 'Change Management / Add or Update ERC Services', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Add or Update ERC Services' }], id: 'updateErc', isRoute: true },
          { text: 'Change Management / Add or Update MOPD', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Add or Update MOPD' }], id: 'addUpdateMopd', isRoute: true },
          { text: 'Change Management / Add Service Initiation Date / Actual Discharge Date / Actual Transition Date', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Add Service Initiation Date / Actual Discharge Date / Actual Transition Date' }], id: 'addServiceDates', isRoute: true },
          { text: 'Change Management / Change from DD to ID', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Change from DD to ID' }], id: 'changeDdId', isRoute: true },
          { text: 'Change Management / Disenrollment', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Disenrollment' }], id: 'disenrollment', isRoute: true },
          { text: 'Change Management / Facility Transfer', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Facility Transfer' }], id: 'facilityTransfer', isRoute: true },
          { text: 'Change Management / Level of Care (LOC) Reassessment', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Level of Care (LOC) Reassessment' }], id: 'locReassignment', isRoute: true },
          { text: 'Change Management / Level of Need', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Level of Need' }], id: 'levelOfNeed', isRoute: true },
          { text: 'Change Management / Manage Entity Association', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Manage Entity Association' }], id: 'entityAssociation', isRoute: true },
          { text: 'Change Management / Override Adjudication Results', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Override Adjudication Results' }], id: 'adjudication', isRoute: true },
          { text: 'Change Management / Complete Referral Intake', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Complete Referral Intake' }], id: 'completeReferral', isRoute: true },
          { text: 'Change Management / Override Enrollment', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Override Enrollment' }], id: 'enrollmentOverride', isRoute: true },
          { text: 'Change Management / Recertification (PACE, ECF 7, ECF 8)', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Recertification (PACE, ECF 7, ECF 8)' }], id: 'recertification', isRoute: true },
          { text: 'Change Management / Reinstate Member', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Reinstate Member' }], id: 'reinstateMember', isRoute: true },
          { text: 'Change Management / Revise PAE', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Revise PAE' }], id: 'revisePae', isRoute: true },
          { text: 'Change Management / Withdraw an Enrollment Request', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Withdraw an Enrollment Request' }], id: 'withdrawEnrollment', isRoute: true },
          { text: 'Change Management / SIS Assessment', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'SIS Assessment' }], id: 'sisAssessment', isRoute: true },
          { text: 'Change Management / Submit Cost Cap Exception\u00a0Request', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Submit Cost Cap Exception\u00a0Request' }], id: 'costCapException', isRoute: true },
          { text: 'Change Management / Update Address on File', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Update Address on File' }], id: 'updateAddressOnFile', isRoute: true },
          { text: 'Change Management / Update Demographic Information', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Update Demographic Information' }], id: 'updateDemoInfo', isRoute: true },
          { text: 'Change Management / Update Hospice Effective\u00a0Date', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Update Hospice Effective\u00a0Date' }], id: 'hospiceDate', isRoute: true },
          { text: 'Change Management / Complete Referral Intake', hybridText: [{ text: 'Change Management', routeTo: 'changeManagement' }, { text: 'Complete Referral Intake' }], id: 'completeRefIntake', isRoute: true },
        ]
      },
      {
        id: 'referralListManagement', icon: 'recent_actors', text: 'Referral List Management', phase:['P1', 'P2', 'P3'], children: [

          { text: 'Referral List Management', id: 'referralListDashboard', isRoute: true },
          { text: 'Referral List Management / Referral List Details', hybridText: [{ text: 'Referral List Management', routeTo: '/ltss/referralListManagement/referralListDashboard' }, { text: 'Referral List Details' }], id: 'referralListdetails', isRoute: true },

        ]
      },
      {
        id: 'waitingListManagement', icon: 'access_time', text: 'Waiting List Management',  phase:['P1', 'P2', 'P3'], children: [

          { text: 'Waiting List Management', id: 'waitingListDashboard', isRoute: true },
          { text: 'Waiting List Management / Waiting List Details', id: 'waitingListdetails', isRoute: true },

        ]
      }
    ]
  }, {
    text: 'LTSS FUNCTIONS', id: 'ltss', open: true, children: [
      {
        id: 'adjudicationDashboard', icon: 'gavel', text: 'Adjudication', phase:['P1', 'P2', 'P3'], children: [
          { id: 'adjudicationDetail', text: 'Adjudication / View Details', isRoute: true, showRequired: true }
        ]
      },
      {
        id: 'enrollmentDashboard', icon: 'enhanced_encryption', text: 'Enrollment', phase:['P1', 'P2', 'P3'], children: [
          { id: 'enrollmentDetail', text: 'Enrollment / Enrollment Details', isRoute: true, showRequired: true }]
      },
      { id: 'appeals', icon: 'record_voice_over', text: 'Appeals', phase:['P1', 'P2', 'P3'] },
      { id: 'reports', icon: 'insert_chart', text: 'Reports', phase:['P1', 'P2', 'P3'] },
      {
        id: 'slotManagement', icon: 'border_all', text: 'Slot Management', phase:['P1', 'P2', 'P3'], children: [
          { text: 'Slot Management / Slot Details', id: 'slotDetail', isRoute: true },
          { text: 'Slot Management / Manage Enrollment Targets', id: 'ECF%20CHOICES', isRoute: true },
          { text: 'Slot Management / Manage Enrollment Targets', id: 'Katie%20Beckett', isRoute: true },
          { text: 'Slot Management / Manage Enrollment Targets', id: 'CHOICES%202', isRoute: true },
        ]
      }
    ]
  },
  {
    text: 'ADMIN',
    id: 'admin',
    open: true,
    pageId:'AAMST',
    businessFunctionId:10015,
    children: [
      {
        id: 'manageUserProfiles',
        icon: 'assignment_ind',
        text: 'Manage User Profiles',
        pageTitle: 'Manage User Profiles',
        businessFunctionId:209,
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'manageUserRoles',
        icon: 'group',
        text: 'Manage User Roles',
        pageTitle: 'Manage User Roles',
        businessFunctionId:211,
        dependentBusinessFunctionIds: [2121, 2122],
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'mapBusinessFunctions',
        icon: 'remove_red_eye',
        text: 'Map Business Functions',
        pageTitle: 'Map Roles to Business Functions',
        businessFunctionId:2121,
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'mapTaskQueues',
        icon: 'check_box',
        text: 'Map Task Queues',
        pageTitle: 'Map Task Queues',
        businessFunctionId: 2122,
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'workLoadManagement',
        icon: 'equalizer',
        text: 'Work Load Management',
        pageTitle: 'Work Load Management',
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'qualifiedAssessors',
        icon: 'beenhere',
        text: 'Qualified Assessors',
        pageTitle: 'Qualified Assessors',
        phase:['P1', 'P2', 'P3']
      },
      {
        id: 'personReconciliation',
        icon: 'fingerprint',
        text: 'Person Reconciliation',
        pageTitle: 'Person Reconciliation',
        phase:['P1', 'P2', 'P3'],
        children: [
          {
            text: 'Person Reconciliation',
            id: 'reconciliationDashboard',
            isRoute: true
          },
          {
            text: 'Link/Unlink',
            id: 'linkUnlinkRequest',
            isRoute: true
          },
          {
            text: 'Person Match',
            id: 'prsnDetails',
            isRoute: true
          }
        ]
      },
      {
        id: 'auditSearch',
        icon: null,
        text: 'Audit Search',
        phase:['P4']
      },
      {
        id: 'auditDetails',
        icon: null,
        text: 'Audit Details',
        phase:['P4']
      }
    ]
  }];

  ngOnInit() {

  }

  toggleSideNavAuto(val) {
    console.log('val', val);
    if (val === true && this.isSideNavToggled === true) {
      // no need to do
    } else if (val === true && this.isSideNavToggled === false) {
      this.toggleSideNav();
    } else if (val === false && this.isSideNavToggled === true) {
      this.toggleSideNav();
    } else {
      this.toggleSideNav();
    }
  }

  toggleSideNav() {
    this.isSideNavToggled = !this.isSideNavToggled;
    if (!this.isSideNavToggled) {
      this.isSideNavToggledWait = false;
    }
    else {
      const that = this;
      const timeout = setTimeout(() => {
        that.isSideNavToggledWait = true;
        clearTimeout(timeout);
      }, 950);
    }
  }

  setPageHeader() {
    if (this.currentMenuItem) {
      this.currentMenuItem.selected = false;
    }

    let menuItemMatch = this.menuById[this.pageId];

    if (menuItemMatch) {

      this.showRequired = menuItemMatch.showRequired;
      this.pageHeader = menuItemMatch.pageTitle || menuItemMatch.text;
      this.complexPageHeader = [];
      if (menuItemMatch.hybridText) {
        this.complexPageHeader = menuItemMatch.hybridText;
      }
      if (menuItemMatch.isRoute) {

        this.currentMenuItem = this.menuById[menuItemMatch.parentId];
      } else {
        this.currentMenuItem = menuItemMatch;
      }

      this.currentMenuParent = this.menuById[this.currentMenuItem.parentId];
      this.currentMenuItem.selected = true;

    } else {
      this.showRequired = false;
    }
    if (this.currentUser != null) {
      if (this.currentUser && this.currentUser.firstName && this.currentUser.firstName.length > 0) {
        this.fNameInitial = this.currentUser.firstName.charAt(0);
        this.fName = this.currentUser.firstName;
      }
      if (this.currentUser && this.currentUser.lastName && this.currentUser.lastName.length > 0) {
        this.lNameInitial = this.currentUser.lastName.charAt(0);
        this.lName = this.currentUser.lastName;
      }
      this.userFontSize = Math.min(24, 10 / (this.fName + " " + this.lName).length * 20) + "px";
      this.userInitials = this.fNameInitial + this.lNameInitial;
      this.userInitials = this.userInitials.toUpperCase();
    }

  }

  toggle(event: Event) {
    const control = event.currentTarget as HTMLDivElement;
    const id = control.getAttribute('menuId');
    const menuItem = this.menuById[id];
    menuItem.open = !menuItem.open;
  }

  ngOnDestroy() {
    console.log('leftNav unsubscribed');
    this.subscribed.forEach(subscription => { subscription.unsubscribe(); });
  }

}
