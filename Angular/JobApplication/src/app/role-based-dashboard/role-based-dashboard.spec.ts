import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBasedDashboard } from './role-based-dashboard';

describe('RoleBasedDashboard', () => {
  let component: RoleBasedDashboard;
  let fixture: ComponentFixture<RoleBasedDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBasedDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleBasedDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
