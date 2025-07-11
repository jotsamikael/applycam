import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCentersManagementComponent } from './training-centers-management.component';

describe('TrainingCentersManagementComponent', () => {
  let component: TrainingCentersManagementComponent;
  let fixture: ComponentFixture<TrainingCentersManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCentersManagementComponent]
    });
    fixture = TestBed.createComponent(TrainingCentersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});