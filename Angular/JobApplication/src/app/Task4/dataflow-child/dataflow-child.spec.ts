import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowChild } from './dataflow-child';

describe('DataflowChild', () => {
  let component: DataflowChild;
  let fixture: ComponentFixture<DataflowChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataflowChild],
    }).compileComponents();

    fixture = TestBed.createComponent(DataflowChild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
