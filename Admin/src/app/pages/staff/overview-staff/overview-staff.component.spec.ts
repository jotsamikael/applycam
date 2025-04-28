import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewStaffComponent } from './overview-staff.component';

describe('OverviewStaffComponent', () => {
  let component: OverviewStaffComponent;
  let fixture: ComponentFixture<OverviewStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewStaffComponent]
    });
    fixture = TestBed.createComponent(OverviewStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
