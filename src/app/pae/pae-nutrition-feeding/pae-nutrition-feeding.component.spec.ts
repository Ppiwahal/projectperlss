import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeNutritionFeedingComponent } from './pae-nutrition-feeding.component';

describe('PaeNutritionFeedingComponent', () => {
  let component: PaeNutritionFeedingComponent;
  let fixture: ComponentFixture<PaeNutritionFeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeNutritionFeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeNutritionFeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
