import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsDashboardComponent } from './appeals-dashboard.component';

describe('AppealsDashboardComponent', () => {
  let component: AppealsDashboardComponent;
  let fixture: ComponentFixture<AppealsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
