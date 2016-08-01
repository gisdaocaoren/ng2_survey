/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { SurveyService } from './survey.service';

describe('Service: Survey', () => {
  beforeEach(() => {
    addProviders([SurveyService]);
  });

  it('should ...',
    inject([SurveyService],
      (service: SurveyService) => {
        expect(service).toBeTruthy();
      }));
});
