import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealTypePasrrComponent } from './appeal-type-pasrr.component';

describe('AppealTypePasrrComponent', () => {
  let component: AppealTypePasrrComponent;
  let fixture: ComponentFixture<AppealTypePasrrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealTypePasrrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealTypePasrrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
