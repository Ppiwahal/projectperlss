import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualNoticesSelectRecordComponent } from './manual-notices-select-record.component';

describe('ManualNoticesSelectRecordComponent', () => {
  let component: ManualNoticesSelectRecordComponent;
  let fixture: ComponentFixture<ManualNoticesSelectRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualNoticesSelectRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualNoticesSelectRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
