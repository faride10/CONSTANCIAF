import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicloEscolarComponent } from './ciclo-escolar.component';

describe('CicloEscolarComponent', () => {
  let component: CicloEscolarComponent;
  let fixture: ComponentFixture<CicloEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CicloEscolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CicloEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
