import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeAdditionalBehavioralQualifiersComponent } from './pae-additional-behavioral-qualifiers.component';

describe('PaeAdditionalBehavioralQualifiersComponent', () => {
  let component: PaeAdditionalBehavioralQualifiersComponent;
  let fixture: ComponentFixture<PaeAdditionalBehavioralQualifiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeAdditionalBehavioralQualifiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeAdditionalBehavioralQualifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
