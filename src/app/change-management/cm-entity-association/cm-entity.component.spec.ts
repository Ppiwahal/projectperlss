import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmEntityAssociationComponent } from './cm-entity-association.component';

describe('CmEntityAssociationComponent', () => {
  let component: CmEntityAssociationComponent;
  let fixture: ComponentFixture<CmEntityAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmEntityAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmEntityAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
