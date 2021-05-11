import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrderComponent } from './upload-order.component';

describe('UploadOrderComponent', () => {
  let component: UploadOrderComponent;
  let fixture: ComponentFixture<UploadOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
