import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentePerfilComponent } from './docente-perfil.component';

describe('DocentePerfilComponent', () => {
  let component: DocentePerfilComponent;
  let fixture: ComponentFixture<DocentePerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocentePerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocentePerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
