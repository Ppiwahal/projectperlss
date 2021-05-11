import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDocumentComponent } from './reassign-document.component';

describe('ReassignDocumentComponent', () => {
  let component: ReassignDocumentComponent;
  let fixture: ComponentFixture<ReassignDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
