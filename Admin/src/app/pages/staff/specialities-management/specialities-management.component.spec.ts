import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialitiesManagementComponent } from './specialities-management.component';

describe('SpecialitiesManagementComponent', () => {
  let component: SpecialitiesManagementComponent;
  let fixture: ComponentFixture<SpecialitiesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialitiesManagementComponent]
    });
    fixture = TestBed.createComponent(SpecialitiesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
