import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBusinessFunctionsComponent } from './map-business-functions.component';

describe('MapBusinessFunctionsComponent', () => {
  let component: MapBusinessFunctionsComponent;
  let fixture: ComponentFixture<MapBusinessFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBusinessFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBusinessFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
