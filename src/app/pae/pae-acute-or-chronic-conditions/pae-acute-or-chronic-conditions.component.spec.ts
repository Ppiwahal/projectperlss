import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeAcuteOrChronicConditionsComponent } from './pae-acute-or-chronic-conditions.component';

describe('PaeAcuteOrChronicConditionsComponent', () => {
  let component: PaeAcuteOrChronicConditionsComponent;
  let fixture: ComponentFixture<PaeAcuteOrChronicConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeAcuteOrChronicConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeAcuteOrChronicConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
