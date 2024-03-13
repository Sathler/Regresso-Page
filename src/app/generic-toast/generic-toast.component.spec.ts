import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericToastComponent } from './generic-toast.component';

describe('GenericToastComponent', () => {
  let component: GenericToastComponent;
  let fixture: ComponentFixture<GenericToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericToastComponent]
    });
    fixture = TestBed.createComponent(GenericToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
