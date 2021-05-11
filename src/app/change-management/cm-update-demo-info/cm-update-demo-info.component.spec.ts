import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmUpdateDemoInfoComponent } from './cm-update-demo-info.component';

describe('CmUpdateDemoInfoComponent', () => {
  let component: CmUpdateDemoInfoComponent;
  let fixture: ComponentFixture<CmUpdateDemoInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmUpdateDemoInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmUpdateDemoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
