import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionsDetailsComponent } from './transitions-details.component';

describe('TransitionsDetailsComponent', () => {
  let component: TransitionsDetailsComponent;
  let fixture: ComponentFixture<TransitionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
