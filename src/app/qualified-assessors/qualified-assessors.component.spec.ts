import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiedAssessorsComponent } from './qualified-assessors.component';

describe('QualifiedAssessorsComponent', () => {
  let component: QualifiedAssessorsComponent;
  let fixture: ComponentFixture<QualifiedAssessorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifiedAssessorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiedAssessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
