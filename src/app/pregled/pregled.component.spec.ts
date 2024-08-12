import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledComponent } from './pregled.component';

describe('PregledComponent', () => {
  let component: PregledComponent;
  let fixture: ComponentFixture<PregledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregledComponent]
    });
    fixture = TestBed.createComponent(PregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
