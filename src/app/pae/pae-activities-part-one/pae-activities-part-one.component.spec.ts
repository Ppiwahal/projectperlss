import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeActivitiesPartOneComponent } from './pae-activities-part-one-component';

describe('PaeActivitiesPartOneComponent', () => {
  let component: PaeActivitiesPartOneComponent;
  let fixture: ComponentFixture<PaeActivitiesPartOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeActivitiesPartOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeActivitiesPartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
