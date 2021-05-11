import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSubmitComponent } from './pae-submit.component';

describe('PaeSubmitComponent', () => {
  let component: PaeSubmitComponent;
  let fixture: ComponentFixture<PaeSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
