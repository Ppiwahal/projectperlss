/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaeSkilledServicesDetailsOtherComponent } from './pae-skilled-services-details-other.component';

describe('PaeSkilledServicesDetailsOtherComponent', () => {
  let component: PaeSkilledServicesDetailsOtherComponent;
  let fixture: ComponentFixture<PaeSkilledServicesDetailsOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSkilledServicesDetailsOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSkilledServicesDetailsOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
