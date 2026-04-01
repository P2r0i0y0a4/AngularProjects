import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamData } from './stream-data';

describe('StreamData', () => {
  let component: StreamData;
  let fixture: ComponentFixture<StreamData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamData],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
