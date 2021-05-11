import { Component, OnDestroy, OnInit } from '@angular/core';
import { INCOMPLETE_USERS, ACTIVE_USERS, INACTIVE_USERS, INCOMPLETE, ACTIVE, INACTIVE } from './manage-user-profile.constants';
import {UserProfileService} from './services/user-profile.service';


@Component({
  selector: 'app-manage-user-profiles',
  templateUrl: './manage-user-profiles.component.html',
  styleUrls: ['./manage-user-profiles.component.scss']
})
export class ManageUserProfilesComponent implements OnInit, OnDestroy {

  UserProfiledata:any;
  activeUsersProfileData: any = [];
  inActiveUsersProfileData: any = [];
  incompleteUsersProfileData: any = [];
  currentTableData: any = [];
  activeProfileCount: number = 0;
  inActiveProfileCount: number = 0;
  inCompleteProfileCount: number = 0;
  INCOMPLETE_USERS: string = INCOMPLETE_USERS;
  ACTIVE_USERS: string = ACTIVE_USERS;
  INACTIVE_USERS: string = INACTIVE_USERS;
  subscriptions$:any[] = [];
  userId;
  entityId;

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    const localStorageforLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    this.userId= JSON.parse(localStorageforLocal).userName;
    this.entityId = JSON.parse(localStorageforLocal).entityId;
    const userProfileSubscription$ = this.userProfileService.getUserProfile(this.userId, this.entityId).subscribe(res => {
       this.resetData();
       this.UserProfiledata = res;
       this.prepareStatus();
     });
     this.subscriptions$.push(userProfileSubscription$)
   }

   resetData() {
     this.activeUsersProfileData = [];
     this.inActiveUsersProfileData = [];
     this.incompleteUsersProfileData = [];
     this.currentTableData = [];
     this.activeProfileCount = 0;
     this.inActiveProfileCount = 0;
     this.inCompleteProfileCount = 0;
   }

   prepareStatus(): void {
       this.UserProfiledata.forEach(userData => {
         userData.entityDetails.forEach( userEntity =>{
             let userData1 = Object.assign({}, userData);
             userData1.entityDetails = userEntity;
             if(userEntity.completeSw === INCOMPLETE){
                   this.incompleteUsersProfileData.push(userData1);
                   this.inCompleteProfileCount++;
             }
             if(userEntity.completeSw === "Y" && userEntity.status === ACTIVE){
                  this.activeProfileCount++;
                  this.activeUsersProfileData.push(userData1);
            }
             if(userEntity.status === INACTIVE){
                   this.inActiveProfileCount++;
                   this.inActiveUsersProfileData.push(userData1);
             }
         });
       });
       this.currentTableData = this.incompleteUsersProfileData;
   }

   arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i] === a[j])
          a.splice(j--, 1);
      }
    }

    return a;
  }

   searchCallback(searchForm) {
     let filteredData = []
     let formIsEmpty: boolean = false;
     filteredData = this.arrayUnique(filteredData.concat(this.activeUsersProfileData).concat(this.inActiveUsersProfileData).concat(this.incompleteUsersProfileData));
     if(searchForm.value.entity !=="" || searchForm.value.personSearch !==""
                || searchForm.value.role !=="" || searchForm.value.status !=="" ){
             formIsEmpty = true;
     }
     if (formIsEmpty) {
       let fullName = searchForm.value.personSearch.split(" ");
       if (searchForm.value.personSearch) {
         if(searchForm.value.personSearch.includes("@")){
           filteredData = filteredData.filter(userProfile => {
             if (userProfile.emailAddress.toLowerCase() === searchForm.value.personSearch.toLowerCase())
               return Object.assign({}, userProfile);
           });
         } else if(fullName.length > 1){
           filteredData = filteredData.filter(userProfile => {
             if (userProfile.firstName.toLowerCase() === fullName[0].toLowerCase() ||
               userProfile.lastName.toLowerCase() === fullName[1].toLowerCase())
               return Object.assign({}, userProfile);
           });
         } else {
           filteredData = filteredData.filter(userProfile => {
             if (userProfile.userName.toLowerCase() === searchForm.value.personSearch.toLowerCase() || userProfile.firstName.toLowerCase() === searchForm.value.personSearch.toLowerCase() ||
               userProfile.lastName.toLowerCase() === searchForm.value.personSearch.toLowerCase())
               return Object.assign({}, userProfile);
           });
         }
       }
       if (searchForm.value.entity) {
         filteredData = filteredData.filter(data => {
           if (data.entityDetails.entityId == searchForm.value.entity)
             return  Object.assign({}, data);
         });
       }
       if (searchForm.value.status) {
         filteredData = filteredData.filter(data => {

           if(data.entityDetails.status !== null){
            if(data.entityDetails.status === searchForm.value.status){
             return  Object.assign({}, data);
           }
          }
         });
       }
       if (searchForm.value.role) {
         let word = searchForm.value.role.toLowerCase();
         filteredData = filteredData.filter(data => {
           let userRoles = data.entityDetails.userRoleList.toString().toLowerCase();
           if (userRoles.includes(word))
             return  Object.assign({}, data);
         });
       }
       this.currentTableData = [];
       this.currentTableData = filteredData;
     }
     else{
      this.currentTableData = [];
      this.currentTableData = filteredData;
     }
   }

  reloadData() {
    this.ngOnInit();
  }

   updateTableData(userProfileStatus: string): void {
     this.currentTableData = [];
     if (userProfileStatus === INCOMPLETE_USERS) {
       this.currentTableData = this.incompleteUsersProfileData;
     } else if (userProfileStatus === ACTIVE_USERS) {
       this.currentTableData = this.activeUsersProfileData;
     } else if (userProfileStatus === INACTIVE_USERS) {
       this.currentTableData = this.inActiveUsersProfileData;
     }
   }

   ngOnDestroy(){
    if(this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }
 }

