/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaeSkilledServicesDetailsKbComponent } from './pae-skilled-services-details-kb.component';

describe('PaeSkilledServicesDetailsKbComponent', () => {
  let component: PaeSkilledServicesDetailsKbComponent;
  let fixture: ComponentFixture<PaeSkilledServicesDetailsKbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeSkilledServicesDetailsKbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSkilledServicesDetailsKbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
