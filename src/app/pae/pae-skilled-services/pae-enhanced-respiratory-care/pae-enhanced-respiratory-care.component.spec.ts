import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeEnhancedRespiratoryCareComponent } from './pae-enhanced-respiratory-care.component';

describe('PaeEnhancedRespiratoryCareComponent', () => {
  let component: PaeEnhancedRespiratoryCareComponent;
  let fixture: ComponentFixture<PaeEnhancedRespiratoryCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeEnhancedRespiratoryCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeEnhancedRespiratoryCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
