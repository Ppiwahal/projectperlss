import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesAddrecipientDetailsComponent } from './notices-addrecipient-details.component';

describe('NoticesAddrecipientDetailsComponent', () => {
  let component: NoticesAddrecipientDetailsComponent;
  let fixture: ComponentFixture<NoticesAddrecipientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesAddrecipientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesAddrecipientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
