import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatusTileComponent } from './user-status-tile.component';

describe('UserStatusTileComponent', () => {
  let component: UserStatusTileComponent;
  let fixture: ComponentFixture<UserStatusTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStatusTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatusTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
