import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManualNoticeComponent } from './create-manual-notice.component';

describe('CreateManualNoticeComponent', () => {
  let component: CreateManualNoticeComponent;
  let fixture: ComponentFixture<CreateManualNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateManualNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManualNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
