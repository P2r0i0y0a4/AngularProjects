import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dataflow } from './dataflow';

describe('Dataflow', () => {
  let component: Dataflow;
  let fixture: ComponentFixture<Dataflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dataflow],
    }).compileComponents();

    fixture = TestBed.createComponent(Dataflow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
