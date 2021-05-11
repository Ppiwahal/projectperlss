import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealStartComponent } from './appeal-start.component';

describe('AppealStartComponent', () => {
  let component: AppealStartComponent;
  let fixture: ComponentFixture<AppealStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
