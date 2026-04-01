import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shoes } from './shoes';

describe('Shoes', () => {
  let component: Shoes;
  let fixture: ComponentFixture<Shoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Shoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
