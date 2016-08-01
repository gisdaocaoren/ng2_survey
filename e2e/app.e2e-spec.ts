import { Ng2SurveyPage } from './app.po';

describe('ng2-survey App', function() {
  let page: Ng2SurveyPage;

  beforeEach(() => {
    page = new Ng2SurveyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
