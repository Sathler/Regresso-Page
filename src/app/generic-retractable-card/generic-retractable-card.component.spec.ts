import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRetractableCardComponent } from './generic-retractable-card.component';

describe('GenericRetractableCardComponent', () => {
  let component: GenericRetractableCardComponent;
  let fixture: ComponentFixture<GenericRetractableCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericRetractableCardComponent]
    });
    fixture = TestBed.createComponent(GenericRetractableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
