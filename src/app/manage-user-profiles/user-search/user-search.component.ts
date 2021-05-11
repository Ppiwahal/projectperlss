import { Component, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { INCOMPLETE_USERS, ACTIVE_USERS, INACTIVE_USERS, INCOMPLETE, ACTIVE, INACTIVE } from '../manage-user-profile.constants';
import {UserProfileService} from '../services/user-profile.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, OnDestroy {

  isReadOnlyUser: boolean;

  constructor(private formBuilder: FormBuilder, private userProfileService: UserProfileService, private authenticationSevice: AuthenticationService) {
    this.isReadOnlyUser = authenticationSevice.isCurrentPageReadOnly();
  }

  userProfileSearch: FormGroup;
  personSearch = 'Search by User Name, Name or Email address';
  entity = 'Entity';
  status = 'Status';
  roles = 'User Role';
  ACTIVE: string = ACTIVE;
  INACTIVE: string = INACTIVE;
  INCOMPLETE: string = INCOMPLETE;
  statusOptions: any;
  entityOptions: any;
  roleOptions: any;
  @Input() userSearchTitle: String = 'User Search';
  @Output() searchUsersCallback: EventEmitter<any> = new EventEmitter<any>();
  subscriptions$: any[] = [];

  ngOnInit(): void {
    this.userProfileSearch = this.formBuilder.group({
      personSearch: [''],
      entity: [''],
      status: [''],
      role: ['']
    });
    if (this.isReadOnlyUser) {
      const entityId = JSON.parse(localStorage.getItem('APP_STORAGE_TOKEN')).entityId;
      this.userProfileSearch.get('entity').setValue(entityId.toString());
      this.userProfileSearch.get('entity').disable();
    }
    const userStatusSubscription$ = this.userProfileService.getSearchDropdowns('USER_STATUS').subscribe( res => {
       this.statusOptions = res;
    });
    this.subscriptions$.push(userStatusSubscription$);

    const userEntitySubscription$  = this.userProfileService.getEntityDropdown().subscribe( res => {
      this.entityOptions = res;
    });
    this.subscriptions$.push(userEntitySubscription$);

    const userRolesSubscription$ = this.userProfileService.getSecRoleDetails().subscribe( res => {
      this.roleOptions = res;
    });
    this.subscriptions$.push(userRolesSubscription$);
  }

  search(): void {
    this.searchUsersCallback.emit(this.userProfileSearch);
  }
  OnEntityChange(event: any){
   if (event.value != '--'){
    this.userProfileService.getSecRoleDetails().subscribe(res => {
      this.roleOptions = res.filter(item => (String(item.entityId) === event.value));
    });
  }else{
    this.userProfileService.getSecRoleDetails().subscribe(res => {
      this.roleOptions = res;
    });
  }
}

  ngOnDestroy(){
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
   }

}
