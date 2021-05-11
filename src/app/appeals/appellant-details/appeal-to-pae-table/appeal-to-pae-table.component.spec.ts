import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealToPaeTableComponent } from './appeal-to-pae-table.component';

describe('AppealToPaeTableComponent', () => {
  let component: AppealToPaeTableComponent;
  let fixture: ComponentFixture<AppealToPaeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealToPaeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealToPaeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
