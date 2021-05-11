import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-slot-management',
  templateUrl: './slot-management.component.html',
  styleUrls: ['./slot-management.component.scss']
})
export class SlotManagementComponent implements OnInit {
  searchResults: any;
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  handleSearchRequest(data) {
    this.searchResults = data;
  }

}
