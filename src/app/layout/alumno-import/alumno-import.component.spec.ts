import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoImportComponent } from './alumno-import.component';

describe('AlumnoImportComponent', () => {
  let component: AlumnoImportComponent;
  let fixture: ComponentFixture<AlumnoImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
