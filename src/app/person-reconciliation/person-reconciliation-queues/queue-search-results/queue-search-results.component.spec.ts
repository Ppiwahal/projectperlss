import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSearchResultsComponent } from './queue-search-results.component';

describe('QueueSearchResultsComponent', () => {
  let component: QueueSearchResultsComponent;
  let fixture: ComponentFixture<QueueSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
