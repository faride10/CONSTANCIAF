import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonenteFormComponent } from './ponente-form.component';

describe('PonenteFormComponent', () => {
  let component: PonenteFormComponent;
  let fixture: ComponentFixture<PonenteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonenteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
