import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationRequiredComponent } from './documentation-required.component';

describe('DocumentationRequiredComponent', () => {
  let component: DocumentationRequiredComponent;
  let fixture: ComponentFixture<DocumentationRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentationRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
