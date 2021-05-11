import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefConfirmationComponent } from './ref-confirmation.component';

describe('RefConfirmationComponent', () => {
  let component: RefConfirmationComponent;
  let fixture: ComponentFixture<RefConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
