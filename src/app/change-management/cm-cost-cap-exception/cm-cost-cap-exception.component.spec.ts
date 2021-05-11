import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCostCapExceptionComponent } from './cm-cost-cap-exception.component';

describe('CmCostCapExceptionComponent', () => {
  let component: CmCostCapExceptionComponent;
  let fixture: ComponentFixture<CmCostCapExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCostCapExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCostCapExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
