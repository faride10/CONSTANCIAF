import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAsistenciaComponent } from './gestion-asistencia.component';

describe('GestionAsistenciaComponent', () => {
  let component: GestionAsistenciaComponent;
  let fixture: ComponentFixture<GestionAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
