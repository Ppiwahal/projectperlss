import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManualTaskComponent } from './create-manual-task.component';

describe('CreateManualTaskComponent', () => {
  let component: CreateManualTaskComponent;
  let fixture: ComponentFixture<CreateManualTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateManualTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManualTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
