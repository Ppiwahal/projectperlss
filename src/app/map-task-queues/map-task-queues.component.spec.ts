import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTaskQueuesComponent } from './map-task-queues.component';

describe('MapTaskQueuesComponent', () => {
  let component: MapTaskQueuesComponent;
  let fixture: ComponentFixture<MapTaskQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTaskQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTaskQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
