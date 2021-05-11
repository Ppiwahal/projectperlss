import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSelectProgramComponent } from './pae-select-program.component';

describe('PaeSelectProgramComponent', () => {
  let component: PaeSelectProgramComponent;
  let fixture: ComponentFixture<PaeSelectProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSelectProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSelectProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
