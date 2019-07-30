import { TestBed } from '@angular/core/testing';

import { PostGrestService } from './post-grest.service';

describe('PostGrestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostGrestService = TestBed.get(PostGrestService);
    expect(service).toBeTruthy();
  });
});
