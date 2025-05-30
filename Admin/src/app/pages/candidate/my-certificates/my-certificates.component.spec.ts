import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCertificatesComponent } from './my-certificates.component';

describe('MyCertificatesComponent', () => {
  let component: MyCertificatesComponent;
  let fixture: ComponentFixture<MyCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCertificatesComponent]
    });
    fixture = TestBed.createComponent(MyCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
