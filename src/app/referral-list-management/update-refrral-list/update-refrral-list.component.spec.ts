import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRefrralListComponent } from './update-refrral-list.component';

describe('UpdateRefrralListComponent', () => {
  let component: UpdateRefrralListComponent;
  let fixture: ComponentFixture<UpdateRefrralListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRefrralListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRefrralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
