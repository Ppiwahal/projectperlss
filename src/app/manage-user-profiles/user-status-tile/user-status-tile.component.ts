import { Component,Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-status-tile',
  templateUrl: './user-status-tile.component.html',
  styleUrls: ['./user-status-tile.component.scss']
})
export class UserStatusTileComponent implements OnInit {

  constructor() { }

  @Input() profileCount: number;
  @Input() profileName: string;
  @Input() profileColor: string = 'green';
  @Output() userProfileTileCallback: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
  }

  onTileClick(profileName:string) {
    this.userProfileTileCallback.emit(profileName);
  }

}
