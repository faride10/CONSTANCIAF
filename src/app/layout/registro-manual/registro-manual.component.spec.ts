import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroManualComponent } from './registro-manual.component';

describe('RegistroManualComponent', () => {
  let component: RegistroManualComponent;
  let fixture: ComponentFixture<RegistroManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
