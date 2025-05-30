import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCenterManagementComponent } from './training-center-management.component';

describe('TrainingCenterManagementComponent', () => {
  let component: TrainingCenterManagementComponent;
  let fixture: ComponentFixture<TrainingCenterManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCenterManagementComponent]
    });
    fixture = TestBed.createComponent(TrainingCenterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
