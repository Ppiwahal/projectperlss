import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeCapabilitiesKbPartTwoComponent} from './pae-capabilites-kb-part-two.component';

describe('PaeCapabilitiesKbPartTwoComponent', () => {
  let component: PaeCapabilitiesKbPartTwoComponent;
  let fixture: ComponentFixture<PaeCapabilitiesKbPartTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeCapabilitiesKbPartTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeCapabilitiesKbPartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
