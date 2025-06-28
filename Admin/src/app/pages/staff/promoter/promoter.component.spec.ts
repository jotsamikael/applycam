import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoterComponent } from './promoter.component';

describe('PromoterComponent', () => {
  let component: PromoterComponent;
  let fixture: ComponentFixture<PromoterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromoterComponent]
    });
    fixture = TestBed.createComponent(PromoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
