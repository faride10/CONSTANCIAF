import { TestBed } from '@angular/core/testing';
import { PonenteService } from './ponente.service';


describe('PonenteService', () => {
  let service: PonenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PonenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
