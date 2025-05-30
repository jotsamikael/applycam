import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemBackupsComponent } from './system-backups.component';

describe('SystemBackupsComponent', () => {
  let component: SystemBackupsComponent;
  let fixture: ComponentFixture<SystemBackupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemBackupsComponent]
    });
    fixture = TestBed.createComponent(SystemBackupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
