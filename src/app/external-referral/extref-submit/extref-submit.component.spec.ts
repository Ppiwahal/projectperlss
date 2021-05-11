import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefSubmitComponent } from './extref-submit.component';

describe('ExtrefSubmitComponent', () => {
  let component: ExtrefSubmitComponent;
  let fixture: ComponentFixture<ExtrefSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
