import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusManagementComponent } from './campus-management.component';

describe('CampusManagementComponent', () => {
  let component: CampusManagementComponent;
  let fixture: ComponentFixture<CampusManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampusManagementComponent]
    });
    fixture = TestBed.createComponent(CampusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
