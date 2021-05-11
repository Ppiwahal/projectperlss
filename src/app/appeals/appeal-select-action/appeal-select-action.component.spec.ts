import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealSelectActionComponent } from './appeal-select-action.component';

describe('AppealSelectActionComponent', () => {
  let component: AppealSelectActionComponent;
  let fixture: ComponentFixture<AppealSelectActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealSelectActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealSelectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
