import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocketComponent } from './update-docket.component';

describe('UpdateDocketComponent', () => {
  let component: UpdateDocketComponent;
  let fixture: ComponentFixture<UpdateDocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDocketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
