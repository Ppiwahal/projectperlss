import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MDMLookupPopupComponent } from './mdm-lookup-popup.component';

describe('MDMLookupPopupComponent', () => {
  let component: MDMLookupPopupComponent;
  let fixture: ComponentFixture<MDMLookupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MDMLookupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MDMLookupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
