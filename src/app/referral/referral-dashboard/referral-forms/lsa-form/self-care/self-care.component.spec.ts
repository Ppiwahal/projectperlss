import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCareComponent } from './self-care.component';

describe('SelfCareComponent', () => {
  let component: SelfCareComponent;
  let fixture: ComponentFixture<SelfCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
