import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealTypeComponent } from './appeal-type.component';

describe('AppealTypeComponent', () => {
  let component: AppealTypeComponent;
  let fixture: ComponentFixture<AppealTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
