import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonReconciliationDashboardComponent } from './person-reconciliation-dashboard.component';

describe('PersonReconciliationDashboardComponent', () => {
  let component: PersonReconciliationDashboardComponent;
  let fixture: ComponentFixture<PersonReconciliationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReconciliationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonReconciliationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
