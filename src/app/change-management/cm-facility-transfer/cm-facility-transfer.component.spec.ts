import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmFacilityTransferComponent } from './cm-facility-transfer.component';

describe('CmFacilityTransferComponent', () => {
  let component: CmFacilityTransferComponent;
  let fixture: ComponentFixture<CmFacilityTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmFacilityTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmFacilityTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
