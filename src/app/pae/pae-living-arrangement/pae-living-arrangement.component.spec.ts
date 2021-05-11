import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeLivingArrangementComponent } from './pae-living-arrangement.component';

describe('PaeLivingArrangementComponent', () => {
  let component: PaeLivingArrangementComponent;
  let fixture: ComponentFixture<PaeLivingArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeLivingArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeLivingArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
