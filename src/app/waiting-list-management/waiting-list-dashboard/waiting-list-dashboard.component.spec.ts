import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingListDashboardComponent } from './waiting-list-dashboard.component';

describe('WaitingListDashboardComponent', () => {
  let component: WaitingListDashboardComponent;
  let fixture: ComponentFixture<WaitingListDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingListDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
