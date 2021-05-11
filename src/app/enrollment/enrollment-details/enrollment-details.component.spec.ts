import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {EnrollmentDetailsComponent} from "./enrollment-details.component";

describe('EnrollmentDetailsComponent', () => {
  let component: EnrollmentDetailsComponent;
  let fixture: ComponentFixture<EnrollmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjudicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
