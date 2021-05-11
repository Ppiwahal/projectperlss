import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCapablitiesKbPartOneComponent} from './pae-activities-kb-part-one.component';

describe(' PaeCapablitiesKbPartOneComponent', () => {
  let component:  PaeCapablitiesKbPartOneComponent;
  let fixture: ComponentFixture<PaeCapablitiesKbPartOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  PaeCapablitiesKbPartOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( PaeCapablitiesKbPartOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
