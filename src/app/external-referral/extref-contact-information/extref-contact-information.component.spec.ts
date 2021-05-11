import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrefContactInformationComponent } from './extref-contact-information.component';

describe('ExtrefContactInformationComponent', () => {
  let component: ExtrefContactInformationComponent;
  let fixture: ComponentFixture<ExtrefContactInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrefContactInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrefContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
