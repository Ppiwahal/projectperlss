import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefContactComponent } from './ref-contact.component';

describe('RefContactComponent', () => {
  let component: RefContactComponent;
  let fixture: ComponentFixture<RefContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
