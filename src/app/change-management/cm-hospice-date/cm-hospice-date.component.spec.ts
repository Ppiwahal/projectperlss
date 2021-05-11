import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmHospiceDateComponent } from './cm-hospice-date.component';

describe('CmHospiceDateComponent ', () => {
  let component: CmHospiceDateComponent;
  let fixture: ComponentFixture<CmHospiceDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmHospiceDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmHospiceDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
