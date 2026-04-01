import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallary } from './gallary';

describe('Gallary', () => {
  let component: Gallary;
  let fixture: ComponentFixture<Gallary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gallary],
    }).compileComponents();

    fixture = TestBed.createComponent(Gallary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
