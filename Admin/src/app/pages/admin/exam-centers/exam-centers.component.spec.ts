import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCentersComponent } from './exam-centers.component';

describe('ExamCentersComponent', () => {
  let component: ExamCentersComponent;
  let fixture: ComponentFixture<ExamCentersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamCentersComponent]
    });
    fixture = TestBed.createComponent(ExamCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
