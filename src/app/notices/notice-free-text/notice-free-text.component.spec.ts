import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeFreeTextComponent } from './notice-free-text.component';

describe('NoticeFreeTextComponent', () => {
  let component: NoticeFreeTextComponent;
  let fixture: ComponentFixture<NoticeFreeTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeFreeTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeFreeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
