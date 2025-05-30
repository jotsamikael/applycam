import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemStatisticsComponent } from './system-statistics.component';

describe('SystemStatisticsComponent', () => {
  let component: SystemStatisticsComponent;
  let fixture: ComponentFixture<SystemStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemStatisticsComponent]
    });
    fixture = TestBed.createComponent(SystemStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
