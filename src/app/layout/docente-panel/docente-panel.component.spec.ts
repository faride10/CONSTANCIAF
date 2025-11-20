import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentePanelComponent } from './docente-panel.component';

describe('DocentePanelComponent', () => {
  let component: DocentePanelComponent;
  let fixture: ComponentFixture<DocentePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocentePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocentePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
