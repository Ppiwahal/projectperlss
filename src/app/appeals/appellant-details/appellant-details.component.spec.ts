import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppellantDetailsComponent } from './appellant-details.component';

describe('AppellantDetailsComponent', () => {
  let component: AppellantDetailsComponent;
  let fixture: ComponentFixture<AppellantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppellantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppellantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
