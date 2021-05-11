import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeLocDeterminationComponent } from './pae-loc-determination.component';

describe('PaeLocDeterminationComponent', () => {
  let component: PaeLocDeterminationComponent;
  let fixture: ComponentFixture<PaeLocDeterminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeLocDeterminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeLocDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
