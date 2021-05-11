import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefAddressValidationComponent } from './extref-address-validation.component'

describe('ExtrefAddressValidationComponent', () => {
  let component: ExtrefAddressValidationComponent;
  let fixture: ComponentFixture<ExtrefAddressValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefAddressValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefAddressValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
