import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaeSisInformantComponent } from './pae-sis-informant.component';

describe('PaeSisInformantComponent', () => {
  let component: PaeSisInformantComponent;
  let fixture: ComponentFixture<PaeSisInformantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaeSisInformantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaeSisInformantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
