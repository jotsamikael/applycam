import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsManagementComponent } from './results-management.component';

describe('ResultsManagementComponent', () => {
  let component: ResultsManagementComponent;
  let fixture: ComponentFixture<ResultsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsManagementComponent]
    });
    fixture = TestBed.createComponent(ResultsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
