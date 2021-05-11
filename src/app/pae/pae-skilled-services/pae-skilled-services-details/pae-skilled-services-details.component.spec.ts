import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSkilledServicesDetailsComponent } from './pae-skilled-services-details.component';

describe('PaeSkilledServicesDetailsComponent', () => {
  let component: PaeSkilledServicesDetailsComponent;
  let fixture: ComponentFixture<PaeSkilledServicesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeSkilledServicesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSkilledServicesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
