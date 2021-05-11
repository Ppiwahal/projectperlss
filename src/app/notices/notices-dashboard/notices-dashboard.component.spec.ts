import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesDashboardComponent } from './notices-dashboard.component';

describe('NoticesDashboardComponent', () => {
  let component: NoticesDashboardComponent;
  let fixture: ComponentFixture<NoticesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
