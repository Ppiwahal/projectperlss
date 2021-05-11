import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeComponent } from './pae.component';

describe('PaeComponent', () => {
  let component: PaeComponent;
  let fixture: ComponentFixture<PaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
