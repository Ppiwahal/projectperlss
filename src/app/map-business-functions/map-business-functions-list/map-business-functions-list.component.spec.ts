import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBusinessFunctionsListComponent } from './map-business-functions-list.component';

describe('MapBusinessFunctionsListComponent', () => {
  let component: MapBusinessFunctionsListComponent;
  let fixture: ComponentFixture<MapBusinessFunctionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBusinessFunctionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBusinessFunctionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
