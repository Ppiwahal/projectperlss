import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssessorResultComponent } from './search-assessor-result.component';

describe('SearchAssessorResultComponent', () => {
  let component: SearchAssessorResultComponent;
  let fixture: ComponentFixture<SearchAssessorResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAssessorResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssessorResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
