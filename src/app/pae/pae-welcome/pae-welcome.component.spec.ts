import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeWelcomeComponent} from './pae-welcome.component';

describe('PaeWelcomeComponent', () => {
  let component: PaeWelcomeComponent;
  let fixture: ComponentFixture<PaeWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaeWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
