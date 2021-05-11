import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-list-dashboard',
  templateUrl: './waiting-list-dashboard.component.html',
  styleUrls: ['./waiting-list-dashboard.component.scss']
})
export class WaitingListDashboardComponent implements OnInit {

  displaySearchResult = false;
  searchResults: any[];

  constructor() { }

  ngOnInit(): void {
  }

  handleSearchRequest(data) {
    this.displaySearchResult = true;
    this.searchResults = data;
  }

}
