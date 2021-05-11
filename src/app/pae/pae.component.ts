import { Component, OnInit } from '@angular/core';
import { User } from '../core';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  NavigationError,
} from '@angular/router';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { filter } from 'rxjs/operators';
import { PaeService } from '../core/services/pae/pae.service';
import { PaeCommonService } from '../core/services/pae/pae-common/pae-common.service';
import { RoutingService } from '../core/services/routing/routing-service.service';
import { Subscription } from 'rxjs';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-pae',
  templateUrl: './pae.component.html',
  styleUrls: ['./pae.component.scss'],
})
export class PaeComponent implements OnInit {
  showAllItems = false;
  isSideNavToggled = true;
  isLoginPage = true;
  currentUrl: string;
  pageHeader = 'Applicant Information';
  isPersonDetailsDropDownToggled = false;
  isProgramRequestDropDownToggled = false;
  isDiagnosisDropDownToggled = false;
  isAdminDropDownToggled = true;
  currentUser: User;
  currentMenuItem = null;
  pageId: string;
  currentMenuParent = null;
  nullValue = null;
  pageError = null;
  menuById = null;
  pidIdMap = null;
  showRequired = false;
  enabledDiagnosisSummary: boolean;
  subscribed: Array<Subscription> = [];
  menuReady = false;
  enabledMenuItems: any;

  menuData: Array<any> = [
    { text: 'Welcome', id: 'welcome', showRequired: true, pid: 'PPWEL', inProgress: true, completed: false },
    {
      text: 'Person Details',
      id: 'personDetails',
      pid: 'PERDE',
      completed: false,
      inProgress: false,
      children: [
        {
          text: 'Applicant Information',
          id: 'applicantInformation',
          pid: 'PPPAI',
          showRequired: true,
        },
        {
          text: 'Contact Information',
          id: 'contactInformation',
          pid: 'PPPCI',
          showRequired: true,
          disabled: this.paeCommonService.getPaeId() ? false : true,
        },
        {
          text: 'Living Arrangement',
          id: 'livingArrangement',
          pid: 'PPPLA',
          showRequired: true,
          disabled: this.paeCommonService.getPaeId() ? false : true,
        },
        {
          text: 'Appointment',
          id: 'appointment',
          showRequired: true,
          pid: 'PPPAD',
        },
      ],
    },
    {
      text: 'Program Request',
      id: 'programRequest',
      pid: 'PRORE',
      completed: false,
      inProgress: false,
      children: [
        {
          text: 'Select Program',
          id: 'selectProgram',
          pid: 'PPPSP',
          showRequired: true,
        },
      ],
    },
    {
      text: 'Diagnosis',
      id: 'diagnosis',
      pid: 'PAEDI',
      completed: false,
      inProgress: false,
      children: [
        {
          text: 'Diagnosis Summary',
          id: 'diagnosisSummary',
          pid: 'PPDDS',
          showRequired: true,
        },
        {
          text: 'Medical Diagnosis',
          id: 'medicalDiagnosis',
          disabled: true,
          pid: 'PPDMD',
          showRequired: true,
        },
      ],
    },
    {
      text: 'Functional Assessment',
      id: 'functionalAssessmentParent',
      completed: false,
      inProgress: false,
      pid: 'PAEFU',
      children: [
        {
          text: 'Functional Assessment Summary',
          id: 'functionalAssessment',
          pid: 'PPFFA',
          showRequired: true,
        },
        {
          text: 'Activities of Daily Living\u00a0-\u00a0Part\u00a01',
          id: 'activitiesPartOne',
          pid: 'PPFAD',
          disabled: true,
          showRequired: true,
          pairsWith: ['capabilitiesPartOne', 'capabilitiesKbPartOne'],
          hidden: false,
        },
        {
          text: 'Activities of Daily Living\u00a0-\u00a0Part\u00a02',
          id: 'activitiesPartTwo',
          pid: 'PPFAO',
          disabled: true,
          hidden: false,
          pairsWith: ['capabilitiesKbPartTwo', 'capabilitiesPartTwo'],
          showRequired: true,
        },
        {
          text: 'Assessment of Capabilities and Needs\u00a0-\u00a0Part\u00a01',
          id: 'capabilitiesPartOne',
          pid: 'PPFAC',
          disabled: true,
          showRequired: true,
          pairsWith: ['activitiesPartOne', 'capabilitiesKbPartOne'],
          hidden: true,
        },
        {
          text: 'Assessment of Capabilities and Needs\u00a0-\u00a0Part\u00a02',
          id: 'capabilitiesPartTwo',
          pid: 'PPFAA',
          disabled: false,
          hidden: true,
          pairsWith: ['capabilitiesKbPartTwo', 'activitiesPartTwo'],
          showRequired: true,
        },
        {
          text: 'Activities of Daily Living\u00a0-\u00a0Part\u00a01',
          id: 'capabilitiesKbPartOne',
          pid: 'PPFK1',
          disabled: true,
          showRequired: true,
          pairsWith: ['capabilitiesPartOne', 'activitiesPartOne'],
          hidden: true,
        },
        {
          text: 'Activities of Daily Living\u00a0-\u00a0Part\u00a02',
          id: 'capabilitiesKbPartTwo',
          pid: 'PPFK2',
          disabled: true,
          pairsWith: ['capabilitiesPartTwo', 'activitiesPartTwo'],
          hidden: true,
          showRequired: true,
        },
      ],
    },
    {
      text: 'Skilled Services',
      id: 'skilledServices',
      completed: false,
      inProgress: false,
      pid: 'PAESK',
      children: [
        {
          text: 'Skilled Services Summary',
          id: 'skilledServicesSummary',
          pid: 'PPSSS',
        },
        {
          text: 'Skilled Services Details',
          id: 'skilledServicesDetails',
          showRequired: true,
          pid: 'PPSSD',
        },
        {
          text: 'Enhanced Respiratory Care',
          id: 'enhancedRespiratoryCare',
          showRequired: true,
          pid: 'PPSSE',
        },
      ],
    },
    {
      text: 'I/DD Determination',
      id: 'iddDetermination',
      completed: false,
      inProgress: false,
      pid: 'PPIDD',
      children: [
        {
          text: 'I/DD Summary',
          id: 'IddDeterminationSummary',
          pid: 'PPIIS',
          showRequired: true,
        },
        {
          text: 'I/DD Details',
          id: 'IddDetails',
          showRequired: true,
          pid: 'PPIDI',
        },
      ],
    },
    {
      text: 'Behavioral Support',
      id: 'behavioralSupport',
      completed: false,
      inProgress: false,
      pid: 'PAEBE',
      children: [
        {
          text: 'Behavioral Support Summary',
          id: 'behavioralSummary',
          showRequired: true,
          pid: 'PPBBS',
        },
        {
          text: 'Additional Behavioral Qualifiers',
          id: 'AdditionalBehavioralQualifiers',
          showRequired: true,
          pid: 'PPBAB',
        },
        {
          text: 'Physically Aggressive Behaviors',
          id: 'aggressiveBehavior',
          showRequired: true,
          pid: 'PPBPA',
        },
        {
          text: 'Service Systems',
          id: 'ServiceSystemsComponent',
          showRequired: true,
          pid: 'PPBSS',
        },
      ],
    },
    {
      text: 'Prioritization Details',
      id: 'priortizationDetails',
      pid: 'PAEPR',
      completed: false,
      inProgress: false,
      children: [
        {
          text: 'Prioritization Summary',
          id: 'prioritizationSummary',
          pid: 'PPPPS',
        },
        {
          text: 'Medical Prognosis',
          id: 'medicalPrognosis',
          pid: 'PPPMP',
          showRequired: true,
        },
        {
          text: 'Intensive Interventions',
          id: 'intensiveInterventions',
          pid: 'PPPII',
          showRequired: true,
        },
        {
          text: 'Transportation and Specialty Care Needs',
          id: 'transportationSpecialityCare',
          pid: 'PPPTS',
          showRequired: true,
        },
        {
          text: 'Non-Febrile Seizures',
          id: 'nonFebrileSeizures',
          pid: 'PPPNF',
          showRequired: true,
        },
        {
          text: 'Nutrition / Feeding',
          id: 'nutritionFeeding',
          pid: 'PPPNT',
          showRequired: true,
        },
        {
          text: 'Medication Regimen',
          id: 'medicalRegimen',
          pid: 'PPPMR',
          showRequired: true,
        },
        {
          text: 'Caregiver Details',
          id: 'PaeCaregiverDetails',
          pid: 'PPPMR',
          showRequired: true,
        }
      ],
    },
    {
      text: 'Safety Determination',
      id: 'safetyDetermination',
      pid: 'PAESA',
      inProgress: false,
      completed: false,
      children: [
        {
          text: 'Safety Assessment Summary',
          pid: 'PPSDS',
          id: 'safetyAssessmentSummary',
        },
        {
          text: 'Safety Determination Form',
          id: 'safetydetermination',
          pid: 'PPSDF',
          showRequired: true,
        },
        {
          text: 'Fall History',
          id: 'fallHistory',
          pid: 'PPSFH',
          showRequired: true,
        },
      ],
    },
    {
      text: 'Cost Neutrality',
      id: 'costNeutrality',
      completed: false,
      inProgress: false,
      pid: 'PAECO',
      children: [
        {
          text: 'Cost Neutrality Summary',
          id: 'costNeutralitySummary',
          pid: 'PPCNC',
          showRequired: true,
        },
        {
          text: 'Plan of Care',
          id: 'costNeutralityPlanOfCare',
          pid: 'PPCPO',
          showRequired: true,
        },
        {
          text: 'Cost Neutrality Details',
          id: 'costNeutralityDetails',
          pid: 'PPCCD',
          showRequired: true,
        },
      ],
    },
    {
      text: 'Supporting Documentation',
      id: 'supportingDocumentation',
      completed: false,
      inProgress: false,
      pid: 'PAESP',
      children: [
        {
          text: 'LOC Determination',
          id: 'LOCDetermination',
          pid: 'PPLOC',
          showRequired: true,
        },
        {
          text: 'Document Summary',
          id: 'documentSummary',
          pid: 'PPSDD',
          showRequired: true,
        },
      ],
    },
    {
      text: 'Confirmation',
      id: 'confirmation',
      pid: 'PPCON',
      completed: false,
      inProgress: false,
    },
    {
      text: 'Submit',
      id: 'submit',
      pid: 'PAESU',
      completed: false,
      inProgress: false,
      children: [
        {
          text: 'PAE Summary',
          id: 'paeSummary',
          pid: 'PPSPS',
          showRequired: true,
        },
        {
          text: 'Review and Submit',
          id: 'paeReviewSubmit',
          pid: 'PPSRR',
          showRequired: true,
        },
      ],
    },
  ];
  PAE_STATUS = [{code: 'PS', value:'Pending Submission',activateSW:'Y'},
{code: 'AD', value:'Pending Adjudication',activateSW:'Y'},
{code: 'AP', value:'Approved',activateSW:'Y'},
{code: 'AA', value:'Approved At Risk',activateSW:'Y'},
{code: 'DN', value:'Denied',activateSW:'Y'},
{code: 'CL', value:'Closed',activateSW:'Y'},
{code: 'WI', value:'Withdrawn',activateSW:'Y'},
{code: 'IN', value:'Inactive',activateSW:'Y'}];

  defaultPages: any;
  paeStatus: any;
  paeMenuId: string = null;
  enabledItemsReady = false;
  enablingMenuDone = false;
  continueMenuSet = false;
  paeAvailable = false;
  paeId: any;
  menuItemsToDisplay = [];
  personDetails = [];
  completedDisplayMenuItemsFilter: any;
  completedMenu = [];
  inProgressMenu = [];
  notVisitedMenu = [];
  incompleteParentIds = [];
  mapForPaeStatus = new Map();
  
  
  paeStatusList = [
    {code: 'PS', value:'Pending Submission',activateSW:'Y'},
    {code: 'AD', value:'Pending Adjudication',activateSW:'Y'},
    {code: 'AP', value:'Approved',activateSW:'Y'},
    {code: 'AA', value:'Approved At Risk',activateSW:'Y'},
    {code: 'DN', value:'Denied',activateSW:'Y'},
    {code: 'CL', value:'Closed',activateSW:'Y'},
    {code: 'WI', value:'Withdrawn',activateSW:'Y'},
    {code: 'IN', value:'Inactive',activateSW:'Y'}
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private paeService: PaeService,
    private paeCommonService: PaeCommonService,
    private routingService: RoutingService,
    public loaderService: LoaderService

  ) {
	  
	for (const paeStat of this.paeStatusList) {
      this.mapForPaeStatus.set(paeStat.code, paeStat.value);
    }
    
    let that = this;
    if (localStorage.getItem('showAllMenuItems')) {
      this.showAllItems = true;
    }
    this.continueMenuSet = this.paeCommonService.getContinueMenu(); // placeholder
    this.paeId = this.paeCommonService.getPaeId();
    if (this.paeId !== null && this.paeId !== undefined){
      this.paeAvailable = true;
    }
    this.paeStatus = 'PS';
    if (this.paeCommonService.getPaeStatus()){
      this.paeStatus = this.paeCommonService.getPaeStatus();
    }
    this.paeMenuId = this.paeCommonService.getMenuId();

    if (this.continueMenuSet) {
      this.paeService.getPaeMenuPageStatus(this.paeId).then(
        (menuItems) => {
          console.log(menuItems);
          this.paeCommonService.setNextPageIdContinue(menuItems.nextPageId);
          for (const item of menuItems.pageStatusList) {
            this.menuItemsToDisplay.push(item.pageId);
          }

          for (const menuDataIterator of this.menuData) {
            const parentId = menuDataIterator.pid;
            this.completedDisplayMenuItemsFilter = menuItems.pageStatusList.filter(
              function (menuItems) {
                return (
                  menuItems.parentPageId === parentId &&
                  menuItems.completedSw === 'N'
                );
              }
            );

            for (const filterItems of this.completedDisplayMenuItemsFilter) {
              if (this.incompleteParentIds) {
                if ( this.completedDisplayMenuItemsFilter && !this.incompleteParentIds.includes(
                  filterItems.parentPageId
                  )
                ) {
                  this.incompleteParentIds.push(filterItems.parentPageId);
                }
              } else {
                this.incompleteParentIds.push(filterItems.parentPageId);
              }
            }
          }

          console.log(this.incompleteParentIds);

          for (const menuIterator of this.menuData) {
            for (const incompleteParentIds of this.incompleteParentIds) {
              if(menuIterator.pid === incompleteParentIds){
                console.log('true for menuItem', menuIterator.pid);
                menuIterator.completed = false;
              }
              else {
                if (!this.incompleteParentIds.includes(menuIterator.pid)) {
                  menuIterator.completed = true;
                }
              }
            }
          }

          this.paeCommonService.setContinueDisplayMenu(this.menuItemsToDisplay);
          this.addToMenuHandler();
        },
        (err) => {
          console.log('Error Fetching The Menu Items' + err);
        }
      );
    }

    paeService.getPaeDefaultPages().then((response) => {
      let data = {};
      response.forEach((item) => {
        data[item.code] = item.value.split('-');
      });
      this.enabledMenuItems = data;

      if (this.menuReady && !this.enablingMenuDone) {
        this.showEnabledItems();
      }
      this.enabledItemsReady = true;
      console.log(JSON.stringify(this.enabledMenuItems, null, '  '));
    });

    this.subscribed.push(
      this.authenticationService.currentUser.subscribe(
        (x) => (that.currentUser = x)
      )
    );

    this.subscribed.push(
      this.routingService.pageId$.subscribe((pageId) => {
        this.pageId = pageId;
        this.setPageHeader();
        this.addToMenuHandler();
        this.setModuleCompleteCheck();
        window.scrollTo(0, 0);
      })
    );

    this.subscribed.push(
      this.routingService.errorMessage$.subscribe((errorMessage) => {
        this.pageError = errorMessage;
        this.pageHeader = 'Navigation Error';
      })
    );
  }

  ngOnInit() {}

  setModuleCompleteCheck(){
    this.paeId = this.paeCommonService.getPaeId();
    if(this.paeId){
      this.paeAvailable = true;
	  this.paeStatus = 'PS';
		if (this.paeCommonService.getPaeStatus()){
		  this.paeStatus = this.paeCommonService.getPaeStatus();
		}
		
      this.paeService.getPaeMenuPageStatus(this.paeId).then(
        (menuItems) => {
          if(this.paeCommonService.getPaeSubmitted() === true){
            document.getElementById('perlss-sidenavbar').style.pointerEvents = "none";
          }
          console.log(menuItems);
          for (const item of menuItems.pageStatusList) {
            if (item.parentPageId === 'PERDE'){
              if (item.pageId === 'PPPAI' && item.completedSw === 'Y'){
                if (!this.personDetails.includes('PPPAI')){
                  this.personDetails.push(item.pageId);
                }
              }
              if (item.pageId === 'PPPCI' && item.completedSw === 'Y'){
                  if (!this.personDetails.includes('PPPCI')){
                    this.personDetails.push(item.pageId);
                  }
              }
              if (item.pageId === 'PPPLA' && item.completedSw === 'Y'){
                  if (!this.personDetails.includes('PPPLA')){
                    this.personDetails.push(item.pageId);
                  }
              }
              // KB Switch condition.
              if (this.personDetails.includes('PPPAI') && this.personDetails.includes('PPPCI') && this.personDetails.includes('PPPLA')){
                  console.log('PERDE COMPLETED');
                  const index = this.inProgressMenu.indexOf('PERDE');
                  if (index > -1) {
                    this.inProgressMenu.splice(index, 1);
                  }
                  this.completedMenu.push('PERDE');
              }

            }
            if (item.parentPageId === 'PRORE'){
                if (item.pageId === 'PPPSP' && item.completedSw === 'Y'){
                  if (!this.personDetails.includes('PPPSP')){
                    this.personDetails.push(item.pageId);
                  }
                }
                if (this.personDetails.includes('PPPSP')) {
                this.completedMenu.push('PRORE');
                }
              }


            if (item.completedSw === 'Y' && item.summarySw === 'Y' && item.visitedSw === 'Y') {
              console.log('Completed Menu icons for : ' + item.parentPageId);
              if (!this.completedMenu.includes('PERDE')){
                if (!this.completedMenu.includes('PRORE')){
                this.completedMenu.push('PERDE');
                this.completedMenu.push('PRORE');
              }
                else {
                  this.completedMenu.push('PERDE');
                }
              }
              else{
                if(!this.completedMenu.includes(item.parentPageId)){
                  this.completedMenu.push(item.parentPageId);
                }
                // this.completedMenu = [];
              }

              if (!this.completedMenu.includes(item.parentPageId)){
                const index = this.inProgressMenu.indexOf(item.pageId);
                if (index > -1) {
                  this.inProgressMenu.splice(index, 1);
                }
                this.completedMenu.push(item.parentPageId);
              }

            }
            if (item.completedSw === 'N' && item.summarySw === 'Y' && item.visitedSw === 'Y') {
              console.log('InProgress Menu icons for : ' + item.parentPageId);
              this.inProgressMenu = [];
              if (!this.inProgressMenu.includes(item.parentPageId)){
                this.inProgressMenu.push(item.parentPageId);
              }
            }
            if (item.completedSw === 'N' && item.summarySw === 'Y' && item.visitedSw === null) {
              console.log('NO Menu icons for : ' + item.parentPageId);
              this.notVisitedMenu = [];
              if (!this.notVisitedMenu.includes(item.parentPageId)){
                this.notVisitedMenu.push(item.parentPageId);
              }

            }
          }
          for (const menuIterator of this.menuData) {
             for (const inProgressMenu of this.inProgressMenu) {
               if (menuIterator.pid === inProgressMenu){

                 menuIterator.completed = false;
                 menuIterator.inProgress = true;
               }
             }
             for (const completed of this.completedMenu) {
               if (menuIterator.pid === completed){

                 menuIterator.completed = true;
                 menuIterator.inProgress = false;
               }
             }
             for (const notVisted of this.notVisitedMenu) {
               if (menuIterator.pid === notVisted){

                 menuIterator.completed = false;
                 menuIterator.inProgress = false;
               }
             }
          }
        },
        (err) => {
          console.log('Error Fetching The Menu Items' + err);
        }
      );
    }
  }

  addToMenuHandler() {
    let that = this;
    ['ProgramSelectChild', 'PaeDisplayMenu', 'ContinueDisplayMenu'].forEach(
      (name) => {
        let value = that.paeCommonService['get' + name]();
        if (value) {
          that.showEnabledByItemList(value);
          that.paeCommonService['set' + name](null);
        }
      }
    );
  }

  showEnabledItems() {
    this.showEnabledByItemList(this.enabledMenuItems[this.paeMenuId]);
    this.enablingMenuDone = true;
  }

  showEnabledByItemList(idList: Array<string>) {
    let that = this;
    if (idList) {
      idList.forEach((id) => {
        let menuId = that.pidIdMap[id];
        if (!menuId) {
          console.log('Unmapped pidId: ' + id);
        } else {
          that.menuById[menuId].show = true;
          if (that.menuById[menuId].parentId) {
            that.menuById[that.menuById[menuId].parentId].show = true;
          }
        }
      });
    }
    this.menuData.forEach((menuItem) => {
      if (menuItem.show && menuItem.children) {
        let count = 0;
        menuItem.children.forEach((menuSubItem) => {
          if (menuSubItem.show) {
            count++;
          }
        });
        menuItem.disabled = count == 0;
      }
    });
  }

  toggleSideNav() {
    this.isSideNavToggled = !this.isSideNavToggled;
    console.log(this.isSideNavToggled);
  }

  backtoPaeHome() {
    this.paeCommonService.setModule('pae');
    this.router.navigate(['/ltss/pae']);
  }
  setPageHeader() {
    if (!this.menuById) {
      this.menuById = {};
      this.pidIdMap = {};
      for (let i = 0; i < this.menuData.length; i++) {
        let menuItem = this.menuData[i];
        menuItem.show = this.showAllItems;
        if (this.menuById[menuItem.id]) {
          console.log('Duplicate menu Id: ' + menuItem.id);
        }
        this.menuById[menuItem.id] = menuItem;

        if (this.pidIdMap[menuItem.pid]) {
          console.log('Duplicate menu Pid: ' + menuItem.pid);
        }
        this.pidIdMap[menuItem.pid] = menuItem.id;

        if (menuItem.children) {
          for (let j = 0; j < menuItem.children.length; j++) {
            let subMenuItem = menuItem.children[j];
            subMenuItem.parentId = menuItem.id;
            subMenuItem.show = this.showAllItems;

            if (this.menuById[subMenuItem.id]) {
              console.log('Duplicate submenu Id: ' + subMenuItem.id);
            }
            this.menuById[subMenuItem.id] = subMenuItem;

            if (this.pidIdMap[subMenuItem.pid]) {
              console.log('Duplicate subMenu Pid: ' + subMenuItem.pid);
            }
            this.pidIdMap[subMenuItem.pid] = subMenuItem.id;
          }
        }
      }
    }

    if (localStorage.getItem('selectedMenu')) {
      console.log('inside');
      this.menuById['medicalDiagnosis'].disabled = false;
    }

    if (this.currentMenuParent) {
      if (!this.currentMenuParent.completed) {
        this.currentMenuParent.inProgress = false;
      }
      this.currentMenuParent.open = false;
      this.currentMenuParent.active = this.currentMenuItem?.hasChildren
        ? false
        : true;
    }
    if (this.currentMenuItem) {
      this.currentMenuItem.active = true;
      this.currentMenuItem.selected = false;
    }
    this.currentMenuItem = this.menuById[this.pageId];
    if (this.currentMenuItem) {
      if (this.currentMenuItem.parentId) {
        this.currentMenuParent = this.menuById[this.currentMenuItem.parentId];
        this.currentMenuParent.open = true;
        this.currentMenuItem.selected = true;
        if (!this.currentMenuParent.completed) {
          this.currentMenuParent.inProgress = true;
        }
        this.pageHeader =
          (this.currentMenuItem.prefix ? this.currentMenuItem.prefix : '') +
          this.currentMenuItem.text;
        this.showRequired = this.currentMenuItem.showRequired;
      } else {
        this.currentMenuParent = this.currentMenuItem;
        this.currentMenuParent.selected = true;
        this.currentMenuParent.open = true;
        // this.currentMenuItem = null;
        this.pageHeader = this.currentMenuParent.text;
        this.showRequired = this.currentMenuItem.showRequired;
      }
    }

    this.setActive();
  }

  setActive() {
    const functionalAssessmentPaths = this.paeService.getFunctionalRoutes();
    if (functionalAssessmentPaths != null) {
      const paths = [
        'activitiesPartOne',
        'activitiesPartTwo',
        'capabilitiesPartOne',
        'capabilitiesPartTwo',
        'capabilitiesKbPartOne',
        'capabilitiesKbPartTwo',
      ];
      paths.forEach((id) => {
        const item = this.menuById[id];
        item.disabled = true;
        item.hidden = true;
      });
      this.menuById[functionalAssessmentPaths[0]].hidden = false;
      this.menuById[functionalAssessmentPaths[1]].hidden = false;
    }

    for (let i = 0; i < this.menuData.length; i++) {
      let menuItem = this.menuData[i];
      menuItem.active =
        typeof menuItem.children === 'undefined' &&
        this.currentMenuParent?.id != menuItem.id;

      if (menuItem.children) {
        for (let j = 0; j < menuItem.children.length; j++) {
          let subMenuItem = menuItem.children[j];
          let urlMatch = this.currentMenuItem?.id == subMenuItem.id;
          if (urlMatch) {
            if (subMenuItem.disabled) {
              subMenuItem.disabled = false;
            }
            if (subMenuItem.pairsWith) {
              subMenuItem.pairsWith.forEach((element: string) => {
                this.menuById[element].hidden = true;
              });
              subMenuItem.hidden = false;
            }
            subMenuItem.active = false;
          } else {
            subMenuItem.active = true;
          }
        }
      }
    }
    this.menuReady = true;
    if (this.enabledItemsReady && !this.enablingMenuDone) {
      this.showEnabledItems();
    }
  }

  toggle(event: Event) {
    this.paeCommonService.setHideSearchForPerson(true);
    let control = event.currentTarget as HTMLDivElement;
    let id = control.getAttribute('menuId');
    let menuItem = this.menuById[id];
    if (!menuItem.disabled) {
      menuItem.open = !menuItem.open;
    }
  }

  ngOnDestroy() {
    console.log('pae.component unsubscribed');
    this.subscribed.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
