import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesDetailsDashboardComponent } from './notices-details-dashboard.component';

describe('NoticesDetailsDashboardComponent', () => {
  let component: NoticesDetailsDashboardComponent;
  let fixture: ComponentFixture<NoticesDetailsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesDetailsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
