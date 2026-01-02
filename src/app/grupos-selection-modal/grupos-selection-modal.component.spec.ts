import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposSelectionModalComponent } from './grupos-selection-modal.component';

describe('GruposSelectionModalComponent', () => {
  let component: GruposSelectionModalComponent;
  let fixture: ComponentFixture<GruposSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
