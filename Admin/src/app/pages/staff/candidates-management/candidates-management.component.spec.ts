import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesManagementComponent } from './candidates-management.component';

describe('CandidatesManagementComponent', () => {
  let component: CandidatesManagementComponent;
  let fixture: ComponentFixture<CandidatesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatesManagementComponent]
    });
    fixture = TestBed.createComponent(CandidatesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
