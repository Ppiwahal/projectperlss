import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmAddServiceDatesComponent } from './cm-add-service-dates.component';

describe('CmAddServiceDatesComponent', () => {
  let component: CmAddServiceDatesComponent;
  let fixture: ComponentFixture<CmAddServiceDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmAddServiceDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmAddServiceDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
