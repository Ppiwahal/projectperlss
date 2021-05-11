import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmUpdateAddressOnFileComponent } from './cm-update-address-on-file.component';

describe('CmUpdateAddressOnFileComponent', () => {
  let component: CmUpdateAddressOnFileComponent;
  let fixture: ComponentFixture<CmUpdateAddressOnFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmUpdateAddressOnFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmUpdateAddressOnFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
