import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {EnrollmentSearchComponent} from './enrollment-search/enrollment.search.component';



describe('EnrollmentComponent', () => {
  let component: EnrollmentSearchComponent;
  let fixture: ComponentFixture<EnrollmentSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
