import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealRepresentativeComponent } from './appeal-representative.component';

describe('AppealRepresentativeComponent', () => {
  let component: AppealRepresentativeComponent;
  let fixture: ComponentFixture<AppealRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealRepresentativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
