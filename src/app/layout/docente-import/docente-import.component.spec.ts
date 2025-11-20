import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteImportComponent } from './docente-import.component';

describe('DocenteImportComponent', () => {
  let component: DocenteImportComponent;
  let fixture: ComponentFixture<DocenteImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
