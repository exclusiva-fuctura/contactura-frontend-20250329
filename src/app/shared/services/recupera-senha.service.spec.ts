import { TestBed } from '@angular/core/testing';

import { RecuperaSenhaService } from './recupera-senha.service';

describe('RecuperaSenhaService', () => {
  let service: RecuperaSenhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperaSenhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
