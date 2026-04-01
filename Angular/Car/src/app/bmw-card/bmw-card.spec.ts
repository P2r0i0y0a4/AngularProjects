import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmwCard } from './bmw-card';

describe('BmwCard', () => {
  let component: BmwCard;
  let fixture: ComponentFixture<BmwCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmwCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BmwCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
