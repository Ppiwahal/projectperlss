import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { EnvService } from '../../app/_shared/utility/env.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../inbox/task-details/task-details.component';
import { UserDetailsService } from "../core/services/userDetails/userDetails.service";
import { Favorite } from "../../app/_shared/model/Favorite"
import { HttpResponse } from '@angular/common/http';
import { StaticDataMapService } from '../core/helpers/static.data.map.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

export class UserDetailsComponent implements OnInit {
  dataSource: any = [];
  taskQueue: any =[];

  displayedColumns: string[] = ['key', 'value', 'icon'];
  records: any;
  requiredData: any = [];
  myMap = new Map();
  subscriptions$ = [];
  public orderByKey(a, b) {
    return a.key;
  }
  waiting = true;
  displayTable = false;
  hasResults = true;
  serverApiUrl: any;
  retrievedToken: any;
  userId: any;
  entityId = '8001';
  constructor(private http: HttpClient,
              private envService: EnvService,
              private userDetailsService: UserDetailsService,
              private matDialog: MatDialog,
              private staticDataService: StaticDataMapService) {
    this.serverApiUrl = this.envService.apiUrl();
  }

  ngOnInit(): void {
    this.loadData();
    this.taskQueue = this.staticDataService.getStaticDataKeyValue('TASK_QUEUE');
    if(this.taskQueue) {
      for (const taskQ of this.taskQueue) {
        taskQ.code = parseInt(taskQ.code, 10);
        this.myMap.set(taskQ.code, taskQ.value);
      }
    }
    
    this.retrievedToken = JSON.parse(localStorage.getItem('APP_STORAGE_TOKEN'));
    this.userId = this.retrievedToken.userName;
  }

  myFunction() {
    let hasResults = false;
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          hasResults = true;
        } else {
          tr[i].style.display = "none";
        }
      }
    }
    this.hasResults = hasResults;
  }

  loadData() {
    const localStorageLocal = localStorage.getItem('APP_STORAGE_TOKEN');
    const userId = JSON.parse(localStorageLocal).userName;
    const entityId = JSON.parse(localStorageLocal).entityId;
    const loadDataSubscription = this.userDetailsService.getHomeDashboard(userId, entityId)
      .subscribe(data => {
        this.records = data;
        this.dataSource = this.records.supportFunctionHomeFavoriteVOList;
        this.dataSource.sort((a, b) => {
          return b.count - a.count;
        });
        this.dataSource.sort((a, b) => {
          let fa = a.favoriteSw.toLowerCase(), fb = b.favoriteSw.toLowerCase();
          return (fa > fb) ? -1 : (fa < fb) ? 1 : 0;
        });
        this.waiting = false;
        this.displayTable = true;
        this.hasResults = this.records.length > 0;
      });
    this.subscriptions$.push(loadDataSubscription);
  }

  setFavorite(fav: any, tmId: any) {
    if (fav === "N") {
      fav = "Y";
    }
    else {
      fav = "N";
    }
    const savedDetails = new Favorite(
      tmId,
      fav
    );
    const that = this;
    const response = this.userDetailsService.saveHomeDash(savedDetails);
    response.then(function (response: HttpResponse<any>) {
      that.loadData();
    });
  }

  openTaskDetailsDialog(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '250px';
    dialogConfig.maxWidth = '500px';
    dialogConfig.minHeight = '405px';
    dialogConfig.panelClass = 'edit-profile-container';
    dialogConfig.data = { rowData: row };
    this.matDialog.open(TaskDetailsComponent, dialogConfig);
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
