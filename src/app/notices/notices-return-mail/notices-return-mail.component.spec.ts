import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesReturnMailComponent } from './notices-return-mail.component';

describe('NoticesReturnMailComponent', () => {
  let component: NoticesReturnMailComponent;
  let fixture: ComponentFixture<NoticesReturnMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticesReturnMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesReturnMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
