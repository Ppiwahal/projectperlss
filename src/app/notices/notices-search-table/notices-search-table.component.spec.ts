import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesSearchTableComponent } from './notices-search-table.component';

describe('NoticesSearchTableComponent', () => {
  let component: NoticesSearchTableComponent;
  let fixture: ComponentFixture<NoticesSearchTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesSearchTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesSearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
