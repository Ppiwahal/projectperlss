import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCapabilitiesPartOneComponent } from './pae-capabilities-part-one.component';

describe('PaeCapabilitiesPartOneComponent', () => {
  let component: PaeCapabilitiesPartOneComponent;
  let fixture: ComponentFixture<PaeCapabilitiesPartOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeCapabilitiesPartOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCapabilitiesPartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
