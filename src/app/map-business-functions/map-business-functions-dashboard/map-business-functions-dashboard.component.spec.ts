import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBusinessFunctionsDashboardComponent } from './map-business-functions-dashboard.component';

describe('MapBusinessFunctionsDashboardComponent', () => {
  let component: MapBusinessFunctionsDashboardComponent;
  let fixture: ComponentFixture<MapBusinessFunctionsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBusinessFunctionsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBusinessFunctionsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
