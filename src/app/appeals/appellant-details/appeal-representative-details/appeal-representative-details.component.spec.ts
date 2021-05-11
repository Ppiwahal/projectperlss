import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealRepresentativeDetailsComponent } from './appeal-representative-details.component';

describe('AppealRepresentativeDetailsComponent', () => {
  let component: AppealRepresentativeDetailsComponent;
  let fixture: ComponentFixture<AppealRepresentativeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealRepresentativeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealRepresentativeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
