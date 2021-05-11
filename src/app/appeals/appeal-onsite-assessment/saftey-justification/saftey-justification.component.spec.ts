import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafteyJustificationComponent } from './saftey-justification.component';

describe('SafteyJustificationComponent', () => {
  let component: SafteyJustificationComponent;
  let fixture: ComponentFixture<SafteyJustificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafteyJustificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafteyJustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
