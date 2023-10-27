import { TestBed } from '@angular/core/testing';

import { SentencesResolver } from './sentences.resolver';

describe('SentencesResolver', () => {
  let resolver: SentencesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SentencesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
