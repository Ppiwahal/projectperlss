import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOutreachDetailsComponent } from './update-outreach-details.component';

describe('UpdateOutreachDetailsComponent', () => {
  let component: UpdateOutreachDetailsComponent;
  let fixture: ComponentFixture<UpdateOutreachDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateOutreachDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOutreachDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
