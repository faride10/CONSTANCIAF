import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonenteListComponent } from './ponente-list.component';

describe('PonenteListComponent', () => {
  let component: PonenteListComponent;
  let fixture: ComponentFixture<PonenteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonenteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
