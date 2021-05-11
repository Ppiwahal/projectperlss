import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRevisePaeComponent } from './cm-revise-pae.component';

describe('CmRevisePaeComponent', () => {
  let component: CmRevisePaeComponent;
  let fixture: ComponentFixture<CmRevisePaeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmRevisePaeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmRevisePaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
