import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawAppealComponent } from './withdraw-appeal.component';

describe('WithdrawAppealComponent', () => {
  let component: WithdrawAppealComponent;
  let fixture: ComponentFixture<WithdrawAppealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawAppealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawAppealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
