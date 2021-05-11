import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleHearingComponent } from './reschedule-hearing.component';

describe('RescheduleHearingComponent', () => {
  let component: RescheduleHearingComponent;
  let fixture: ComponentFixture<RescheduleHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescheduleHearingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
