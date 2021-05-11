import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAlertsNotificationsComponent } from './my-alerts-notifications.component';

describe('MyAlertsNotificationsComponent', () => {
  let component: MyAlertsNotificationsComponent;
  let fixture: ComponentFixture<MyAlertsNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAlertsNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAlertsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
