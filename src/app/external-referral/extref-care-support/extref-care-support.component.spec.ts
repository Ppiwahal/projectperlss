import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefCareSupportComponent } from './extref-care-support.component';

describe('ExtrefCareSupportComponent', () => {
  let component: ExtrefCareSupportComponent;
  let fixture: ComponentFixture<ExtrefCareSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefCareSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefCareSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
