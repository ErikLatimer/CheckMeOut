import { TestBed } from '@angular/core/testing';

import { ScreenDimensionService } from './screen-dimension.service';

describe('ScreenDimensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenDimensionService = TestBed.get(ScreenDimensionService);
    expect(service).toBeTruthy();
  });
});
