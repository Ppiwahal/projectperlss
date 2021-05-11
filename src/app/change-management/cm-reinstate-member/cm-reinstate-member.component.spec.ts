import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmReinstateMemberComponent } from './cm-reinstate-member.component';

describe('CmReinstateMemberComponent', () => {
  let component: CmReinstateMemberComponent;
  let fixture: ComponentFixture<CmReinstateMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmReinstateMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmReinstateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
