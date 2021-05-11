import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesCorrectionDetailsComponent } from './notices-correction-details.component';

describe('NoticesCorrectionDetailsComponent', () => {
  let component: NoticesCorrectionDetailsComponent;
  let fixture: ComponentFixture<NoticesCorrectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesCorrectionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesCorrectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
