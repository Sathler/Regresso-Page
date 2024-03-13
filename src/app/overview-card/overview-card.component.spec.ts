import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCardComponent } from './overview-card.component';

describe('OverviewCardComponent', () => {
  let component: OverviewCardComponent;
  let fixture: ComponentFixture<OverviewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewCardComponent]
    });
    fixture = TestBed.createComponent(OverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
