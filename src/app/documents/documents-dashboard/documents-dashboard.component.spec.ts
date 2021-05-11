import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardComponent } from './documents-dashboard.component';

describe('DocumentsDashboardComponent', () => {
  let component: DocumentsDashboardComponent;
  let fixture: ComponentFixture<DocumentsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
