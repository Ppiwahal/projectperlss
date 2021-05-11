import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefPersonMatchComponent } from './extref-person-match.component';

describe('ExtrefPersonMatchComponent', () => {
  let component: ExtrefPersonMatchComponent;
  let fixture: ComponentFixture<ExtrefPersonMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefPersonMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefPersonMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
