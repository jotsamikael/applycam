import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCenterDetailsComponent } from './training-center-details.component';

describe('TrainingCenterDetailsComponent', () => {
  let component: TrainingCenterDetailsComponent;
  let fixture: ComponentFixture<TrainingCenterDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCenterDetailsComponent]
    });
    fixture = TestBed.createComponent(TrainingCenterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
