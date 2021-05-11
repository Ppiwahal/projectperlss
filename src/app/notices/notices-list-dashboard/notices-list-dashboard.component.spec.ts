import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesListDashboardComponent } from './notices-list-dashboard.component';

describe('NoticesListDashboardComponent', () => {
  let component: NoticesListDashboardComponent;
  let fixture: ComponentFixture<NoticesListDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesListDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
