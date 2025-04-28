import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoterDashboardComponent } from './promoter-dashboard.component';

describe('PromoterDashboardComponent', () => {
  let component: PromoterDashboardComponent;
  let fixture: ComponentFixture<PromoterDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromoterDashboardComponent]
    });
    fixture = TestBed.createComponent(PromoterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
