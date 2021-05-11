import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkilledServiceComponent } from './skilled-service.component';

describe('SkilledServiceComponent', () => {
  let component: SkilledServiceComponent;
  let fixture: ComponentFixture<SkilledServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkilledServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkilledServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
