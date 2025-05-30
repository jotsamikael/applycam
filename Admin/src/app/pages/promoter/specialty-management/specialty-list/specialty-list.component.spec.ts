import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyListComponent } from './specialty-list.component';

describe('SpecialtyListComponent', () => {
  let component: SpecialtyListComponent;
  let fixture: ComponentFixture<SpecialtyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialtyListComponent]
    });
    fixture = TestBed.createComponent(SpecialtyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
