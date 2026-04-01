import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplication } from './job-application';

describe('JobApplication', () => {
  let component: JobApplication;
  let fixture: ComponentFixture<JobApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(JobApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
