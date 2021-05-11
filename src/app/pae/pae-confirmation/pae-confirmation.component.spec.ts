import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeConfirmationComponent } from './pae-confirmationcomponent';

describe('PaeConfirmationComponent', () => {
  let component: PaeConfirmationComponent;
  let fixture: ComponentFixture<PaeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
