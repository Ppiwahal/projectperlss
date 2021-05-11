import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeActivitiesPartTwoComponent } from './pae-activities-part-two.component';

describe('PaeActivitiesPartTwoComponent', () => {
  let component: PaeActivitiesPartTwoComponent;
  let fixture: ComponentFixture<PaeActivitiesPartTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeActivitiesPartTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeActivitiesPartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
