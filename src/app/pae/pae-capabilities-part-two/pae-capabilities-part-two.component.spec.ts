import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCapabilitiesPartTwoComponent } from './pae-capabilities-part-two.component';

describe('PaeCapabilitiesPartTwoComponent', () => {
  let component: PaeCapabilitiesPartTwoComponent;
  let fixture: ComponentFixture<PaeCapabilitiesPartTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeCapabilitiesPartTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCapabilitiesPartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
