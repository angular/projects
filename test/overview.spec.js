describe('overview ', function () {

  beforeEach(function () {
    browser.get('index.html');
    waitForAngular();
  });

  it('should show at least two github issues', () => {

    var issues = element.all(by.css('.tst-issue'));
    expect(issues.count()).toBeGreaterThan(1);
    expect(issues.get(1).getText()).not.toMatch(/{{|}}/);

  });

  it('should show issue details when clicking on an issue in the overview', () => {

    var firstOverviewIssue = element.all(by.css('.tst-issue-number')).get(0).getText();
    goToFirstIssueDetail();

    expect(element(by.css('.tst-issue-number')).getText()).toEqual(firstOverviewIssue);
    expect(element(by.css('.tst-issue-body')).getText()).toMatch(/\w+/);

  });

  it('should show the comments of an issue when opening the detail view', () => {

    goToFirstIssueDetail();
    expect(element.all(by.css('.tst-viewport comments')).count()).toBe(1);
    expect(element.all(by.css('.tst-viewport events')).count()).toBe(0);

  });

  it('should show the events of an issue when clicking on the events tab', () => {

    goToFirstIssueDetail();
    element.all(by.css('.tst-tab-link')).get(1).click();
    waitForAngular();

    expect(element.all(by.css('.tst-viewport comments')).count()).toBe(0);
    expect(element.all(by.css('.tst-viewport events')).count()).toBe(1);

  });

  function goToFirstIssueDetail() {
    element.all(by.css('.tst-issue-link')).get(0).click();
    waitForAngular();
  }

  // TODO: replace this with a proper protractor/ng2.0 integration
  // and remove this function as well as all method calls.
  function waitForAngular() {
    browser.driver.sleep(2000);
  }

});