import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialitiesComponent } from './specialities.component';

describe('SpecialitiesComponent', () => {
  let component: SpecialitiesComponent;
  let fixture: ComponentFixture<SpecialitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialitiesComponent]
    });
    fixture = TestBed.createComponent(SpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
