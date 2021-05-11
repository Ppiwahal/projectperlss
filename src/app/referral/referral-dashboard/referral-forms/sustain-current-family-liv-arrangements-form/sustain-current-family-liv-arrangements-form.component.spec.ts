import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustainCurrentFamilyLivArrangementsFormComponent } from './sustain-current-family-liv-arrangements-form.component';

describe('SustainCurrentFamilyLivArrangementsFormComponent', () => {
  let component: SustainCurrentFamilyLivArrangementsFormComponent;
  let fixture: ComponentFixture<SustainCurrentFamilyLivArrangementsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustainCurrentFamilyLivArrangementsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustainCurrentFamilyLivArrangementsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
