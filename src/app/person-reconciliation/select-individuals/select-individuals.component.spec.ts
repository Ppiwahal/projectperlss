import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIndividualsComponent } from './select-individuals.component';

describe('SelectIndividualsComponent', () => {
  let component: SelectIndividualsComponent;
  let fixture: ComponentFixture<SelectIndividualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectIndividualsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectIndividualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
