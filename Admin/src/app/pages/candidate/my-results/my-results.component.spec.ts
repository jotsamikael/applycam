import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResultsComponent } from './my-results.component';

describe('MyResultsComponent', () => {
  let component: MyResultsComponent;
  let fixture: ComponentFixture<MyResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyResultsComponent]
    });
    fixture = TestBed.createComponent(MyResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
