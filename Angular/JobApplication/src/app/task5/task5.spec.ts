import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Task5 } from './task5';

describe('Task5', () => {
  let component: Task5;
  let fixture: ComponentFixture<Task5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task5],
    }).compileComponents();

    fixture = TestBed.createComponent(Task5);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
