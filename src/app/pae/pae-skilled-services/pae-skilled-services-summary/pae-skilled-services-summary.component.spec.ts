import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSkilledServicesSummaryComponent } from './pae-skilled-services-summary.component';

describe('PaeSkilledServicesSummaryComponent', () => {
  let component: PaeSkilledServicesSummaryComponent;
  let fixture: ComponentFixture<PaeSkilledServicesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeSkilledServicesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSkilledServicesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
