import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesUpdateStatusComponent } from './notices-update-status.component';

describe('NoticesUpdateStatusComponent', () => {
  let component: NoticesUpdateStatusComponent;
  let fixture: ComponentFixture<NoticesUpdateStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesUpdateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
