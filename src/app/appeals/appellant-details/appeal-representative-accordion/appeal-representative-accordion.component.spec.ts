import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealRepresentativeAccordionComponent } from './appeal-representative-accordion.component';

describe('AppealRepresentativeAccordionComponent', () => {
  let component: AppealRepresentativeAccordionComponent;
  let fixture: ComponentFixture<AppealRepresentativeAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealRepresentativeAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealRepresentativeAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
