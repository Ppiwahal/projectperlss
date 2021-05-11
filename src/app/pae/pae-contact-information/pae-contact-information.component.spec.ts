import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeContactInformationComponent } from './pae-contact-information.component';

describe('PaeContactInformationComponent', () => {
  let component: PaeContactInformationComponent;
  let fixture: ComponentFixture<PaeContactInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeContactInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
