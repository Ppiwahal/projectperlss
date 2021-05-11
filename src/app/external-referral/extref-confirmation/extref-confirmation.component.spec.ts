import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefConfirmationComponent } from './extref-confirmation.component';

describe('ExtrefConfirmationComponent', () => {
  let component: ExtrefConfirmationComponent;
  let fixture: ComponentFixture<ExtrefConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
