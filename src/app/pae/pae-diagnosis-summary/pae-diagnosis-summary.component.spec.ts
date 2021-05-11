import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeDiagnosisSummaryComponent } from './pae-diagnosis-summary.component';

describe('PaeDiagnosisSummaryComponent', () => {
  let component: PaeDiagnosisSummaryComponent;
  let fixture: ComponentFixture<PaeDiagnosisSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeDiagnosisSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeDiagnosisSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
