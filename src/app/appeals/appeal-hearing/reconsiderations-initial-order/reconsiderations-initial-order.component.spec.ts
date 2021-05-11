import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconsiderationsInitialOrderComponent } from './reconsiderations-initial-order.component';

describe('ReconsiderationsInitialOrderComponent', () => {
  let component: ReconsiderationsInitialOrderComponent;
  let fixture: ComponentFixture<ReconsiderationsInitialOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconsiderationsInitialOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconsiderationsInitialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
