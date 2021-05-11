import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmAddUpdateErcComponent } from './cm-add-update-erc.component';

describe('CmAddUpdateErcComponent', () => {
  let component: CmAddUpdateErcComponent;
  let fixture: ComponentFixture<CmAddUpdateErcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmAddUpdateErcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmAddUpdateErcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
