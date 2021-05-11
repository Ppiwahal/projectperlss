import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasrrCorrectionLetterComponent } from './pasrr-correction-letter.component';

describe('PasrrCorrectionLetterComponent', () => {
  let component: PasrrCorrectionLetterComponent;
  let fixture: ComponentFixture<PasrrCorrectionLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasrrCorrectionLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasrrCorrectionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
