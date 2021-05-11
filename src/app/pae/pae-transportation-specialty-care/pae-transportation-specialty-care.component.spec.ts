import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeTransportationSpecialtyCareComponent } from './pae-transportation-specialty-care.component';

describe('PaeTransportationSpecialtyCareComponent', () => {
  let component: PaeTransportationSpecialtyCareComponent;
  let fixture: ComponentFixture<PaeTransportationSpecialtyCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeTransportationSpecialtyCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeTransportationSpecialtyCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
