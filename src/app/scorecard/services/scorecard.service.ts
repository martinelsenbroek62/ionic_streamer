import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {
  public headers = new HttpHeaders();

  constructor(public httpClient: HttpClient) { }

  getBallByBall(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/getBallByBall?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getPlayersToWatch(clubId, fixtureId, limit) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/getPlayersToWatch?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId + '&limit=' + limit);
  }

  getMatchResultsAtGround(clubId, fixtureId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/getMatchResultsAtGround?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId);
  }

  recentForms(clubId, fixtureId, limit) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/recentForms?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId + '&limit=' + limit);
  }

  previousEncounters(clubId, fixtureId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/previousEncounters?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId);
  }

  getMatchInfo(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/match/getMatchInfo?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getMatchInfoHeaders(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/match/getMatchInfoHeaders?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getChartDataSets(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/getChartDataSets?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getScoreCard(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoreCard/getScoreCard?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

}
