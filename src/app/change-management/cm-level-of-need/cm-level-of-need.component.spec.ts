import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmLevelOfNeedComponent } from './cm-level-of-need.component';

describe('CmLevelOfNeedComponent', () => {
  let component: CmLevelOfNeedComponent;
  let fixture: ComponentFixture<CmLevelOfNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmLevelOfNeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmLevelOfNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
