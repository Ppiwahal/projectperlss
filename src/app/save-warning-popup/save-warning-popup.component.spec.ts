import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWarningPopupComponent } from './save-warning-popup.component';

describe('SaveWarningPopupComponent', () => {
  let component: SaveWarningPopupComponent;
  let fixture: ComponentFixture<SaveWarningPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveWarningPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWarningPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
