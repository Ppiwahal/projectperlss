import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingListDetailsComponent } from './waiting-list-search-table.component';

describe('WaitingListDetailsComponent', () => {
  let component: WaitingListDetailsComponent;
  let fixture: ComponentFixture<WaitingListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
