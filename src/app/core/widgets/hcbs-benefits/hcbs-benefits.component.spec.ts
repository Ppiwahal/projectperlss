import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HcbsBenefitsComponent } from './hcbs-benefits.component';

describe('HcbsBenefitsComponent', () => {
  let component: HcbsBenefitsComponent;
  let fixture: ComponentFixture<HcbsBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HcbsBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcbsBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
