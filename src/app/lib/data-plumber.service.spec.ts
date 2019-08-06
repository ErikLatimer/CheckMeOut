import { TestBed } from '@angular/core/testing';

import { DataPlumberService } from './data-plumber.service';

describe('DataPlumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataPlumberService = TestBed.get(DataPlumberService);
    expect(service).toBeTruthy();
  });
});
