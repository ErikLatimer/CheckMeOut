import { TestBed } from '@angular/core/testing';

import { ScreenDimensionsService } from './screen-dimensions.service';

describe('ScreenDimensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenDimensionsService = TestBed.get(ScreenDimensionsService);
    expect(service).toBeTruthy();
  });
});
