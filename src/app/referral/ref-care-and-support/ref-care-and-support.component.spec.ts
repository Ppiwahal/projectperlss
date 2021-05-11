import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefCareAndSupportComponent } from './ref-care-and-support.component';

describe('RefCareAndSupportComponent', () => {
  let component: RefCareAndSupportComponent;
  let fixture: ComponentFixture<RefCareAndSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefCareAndSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefCareAndSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
