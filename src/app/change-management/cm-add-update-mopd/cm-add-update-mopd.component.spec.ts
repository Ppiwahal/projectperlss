import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmAddUpdateMopdComponent } from './cm-add-update-mopd.component';

describe('CmAddUpdateMopdComponent', () => {
  let component: CmAddUpdateMopdComponent;
  let fixture: ComponentFixture<CmAddUpdateMopdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmAddUpdateMopdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmAddUpdateMopdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
