import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOrderComponent } from './initial-order.component';

describe('InitialOrderComponent', () => {
  let component: InitialOrderComponent;
  let fixture: ComponentFixture<InitialOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
