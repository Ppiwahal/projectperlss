import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppellantInfoDemographicComponent } from './appellant-info-demographic.component';

describe('AppellantInfoDemographicComponent', () => {
  let component: AppellantInfoDemographicComponent;
  let fixture: ComponentFixture<AppellantInfoDemographicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppellantInfoDemographicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppellantInfoDemographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
