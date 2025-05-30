import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsCentersManagementComponent } from './exams-centers-management.component';

describe('ExamsCentersManagementComponent', () => {
  let component: ExamsCentersManagementComponent;
  let fixture: ComponentFixture<ExamsCentersManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamsCentersManagementComponent]
    });
    fixture = TestBed.createComponent(ExamsCentersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
