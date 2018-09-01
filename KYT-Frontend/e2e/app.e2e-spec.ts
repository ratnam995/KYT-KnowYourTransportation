import { KYTFrontendPage } from './app.po';

describe('kyt-frontend App', () => {
  let page: KYTFrontendPage;

  beforeEach(() => {
    page = new KYTFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
