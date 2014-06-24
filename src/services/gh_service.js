import {Inject} from 'di';
import {Http} from './http';
import {Config} from './config';

export class GhService {
  @Inject(Http, Config)
  constructor(http, config) {
    this.http = http;
    this.config = config.github;
  }
  _request(suffix) {
    return this.http(`https://api.github.com/repos/${this.config.user}/${this.config.repository}/${suffix}`);
  }
  allIssues() {
    return this._request('issues');
  }

  issue(id) {
    return this._request(`issues/${id}`);
  }

  comments(issueId){
    return this._request(`issues/${issueId}/comments`);
  }

  events(issueId){
    return this._request(`issues/${issueId}/events`);
  }
}