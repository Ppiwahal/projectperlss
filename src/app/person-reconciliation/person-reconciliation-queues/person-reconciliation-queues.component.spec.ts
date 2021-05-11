import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonReconciliationQueuesComponent } from './person-reconciliation-queues.component';

describe('PersonReconciliationQueuesComponent', () => {
  let component: PersonReconciliationQueuesComponent;
  let fixture: ComponentFixture<PersonReconciliationQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReconciliationQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonReconciliationQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
