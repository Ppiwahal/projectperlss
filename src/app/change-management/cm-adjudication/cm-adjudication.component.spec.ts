import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmAdjudicationComponent } from './cm-adjudication.component';

describe('CmAdjudicationComponent', () => {
  let component: CmAdjudicationComponent;
  let fixture: ComponentFixture<CmAdjudicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmAdjudicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmAdjudicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
