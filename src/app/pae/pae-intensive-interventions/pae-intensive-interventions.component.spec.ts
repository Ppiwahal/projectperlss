import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeIntensiveInterventionsComponent } from './pae-intensive-interventions.component';

describe('PaeIntensiveInterventionsComponent', () => {
  let component: PaeIntensiveInterventionsComponent;
  let fixture: ComponentFixture<PaeIntensiveInterventionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeIntensiveInterventionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeIntensiveInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
