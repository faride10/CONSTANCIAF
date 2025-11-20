import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteMiGrupoComponent } from './docente-mi-grupo.component';

describe('DocenteMiGrupoComponent', () => {
  let component: DocenteMiGrupoComponent;
  let fixture: ComponentFixture<DocenteMiGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteMiGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteMiGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
