import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmChangeDdIdComponent } from './cm-change-dd-id.component';

describe('CmChangeDdIdComponent', () => {
  let component: CmChangeDdIdComponent;
  let fixture: ComponentFixture<CmChangeDdIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmChangeDdIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmChangeDdIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
