import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasrrOutcomeComponent } from './pasrr-outcome.component';

describe('PasrrOutcomeComponent', () => {
  let component: PasrrOutcomeComponent;
  let fixture: ComponentFixture<PasrrOutcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasrrOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasrrOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
