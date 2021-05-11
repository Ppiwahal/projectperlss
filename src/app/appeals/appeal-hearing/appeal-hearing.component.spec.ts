import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealHearingComponent } from './appeal-hearing.component';

describe('AppealHearingComponent', () => {
  let component: AppealHearingComponent;
  let fixture: ComponentFixture<AppealHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealHearingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
