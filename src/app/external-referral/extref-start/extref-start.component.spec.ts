import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefStartComponent } from './extref-start.component';

describe('ExtrefStartComponent', () => {
  let component: ExtrefStartComponent;
  let fixture: ComponentFixture<ExtrefStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
