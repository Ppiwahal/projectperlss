import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformLinkComponent } from './conform-link.component';

describe('ConformLinkComponent', () => {
  let component: ConformLinkComponent;
  let fixture: ComponentFixture<ConformLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConformLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
