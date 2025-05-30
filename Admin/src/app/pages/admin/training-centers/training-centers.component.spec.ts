import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCentersComponent } from './training-centers.component';

describe('TrainingCentersComponent', () => {
  let component: TrainingCentersComponent;
  let fixture: ComponentFixture<TrainingCentersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCentersComponent]
    });
    fixture = TestBed.createComponent(TrainingCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
