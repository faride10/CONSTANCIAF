import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceScanComponent } from './attendance-scan.component';

describe('AttendanceScanComponent', () => {
  let component: AttendanceScanComponent;
  let fixture: ComponentFixture<AttendanceScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceScanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
