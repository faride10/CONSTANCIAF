import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteFormComponent } from './docente-form.component';

describe('DocenteFormComponent', () => {
  let component: DocenteFormComponent;
  let fixture: ComponentFixture<DocenteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
