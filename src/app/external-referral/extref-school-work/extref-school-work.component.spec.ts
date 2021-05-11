import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefSchoolWorkComponent } from './extref-school-work.component';

describe('ExtrefSchoolWorkComponent', () => {
  let component: ExtrefSchoolWorkComponent;
  let fixture: ComponentFixture<ExtrefSchoolWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefSchoolWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefSchoolWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
