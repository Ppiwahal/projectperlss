import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSkilledServicesAcknowledgementPopupComponent } from './pae-skilled-services-acknowledgement-popup.component';

describe('PaeSkilledServicesAcknowledgementPopupComponent', () => {
  let component: PaeSkilledServicesAcknowledgementPopupComponent;
  let fixture: ComponentFixture<PaeSkilledServicesAcknowledgementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeSkilledServicesAcknowledgementPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSkilledServicesAcknowledgementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
