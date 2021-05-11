import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealOverviewComponent } from './appeal-overview.component';

describe('AppealOverviewComponent', () => {
  let component: AppealOverviewComponent;
  let fixture: ComponentFixture<AppealOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
