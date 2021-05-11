import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppellantInfoComponent } from './appellant-info.component';

describe('AppellantInfoComponent', () => {
  let component: AppellantInfoComponent;
  let fixture: ComponentFixture<AppellantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppellantInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppellantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
