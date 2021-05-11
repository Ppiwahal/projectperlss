import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingListQueuesComponent } from './waiting-list-queues.component';

describe('WaitingListQueuesComponent', () => {
  let component: WaitingListQueuesComponent;
  let fixture: ComponentFixture<WaitingListQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingListQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingListQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
