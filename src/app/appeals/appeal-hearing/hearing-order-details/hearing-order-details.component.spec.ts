import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingOrderDetailsComponent } from './hearing-order-details.component';

describe('HearingOrderDetailsComponent', () => {
  let component: HearingOrderDetailsComponent;
  let fixture: ComponentFixture<HearingOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HearingOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
