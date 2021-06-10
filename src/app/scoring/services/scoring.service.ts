import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {
  public headers = new HttpHeaders();

  observableEndScorerSession = new Subject();
  endScorerSessionSubscriber: any;

  constructor(public httpClient: HttpClient) { }

  getLiveStreamScheduleMatches(clubId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livestream/schedules?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId);
  }

  getLiveScoringScheduleMatches(clubId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/schedules?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId);
  }

  getMyLeagues() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/mygame/my-clubs?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getLiveScoringTeamsForLiveMatchCreation(clubId, fixtureId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/get/details/forLiveMatchCreation?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId);
  }

  // to create match - initially from create match page
  createLiveMatch(clubId, fixtureId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/createLiveMatch?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId, data, { headers: this.headers });
  }
  // to update match details from scoring screen
  updateMatchData(clubId, matchId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/saveLiveMatchInfo?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId, data, { headers: this.headers });
  }

  getLiveMatchInfo(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/getLiveMatchInfo?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getBalls(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/getBalls?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  saveBallData(clubId, matchId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/saveBalls?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId, data, { headers: this.headers });
  }

  deleteBalls(clubId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/deleteBalls?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId, data, { headers: this.headers });
  }

  endScoringSession(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/endScorerSession?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  saveDelayedMatchData(clubId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/saveDLInterruption?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId, data, { headers: this.headers });
  }

  getManOfTheMatchInfo(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/getManOfTheMatchInfo?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  setManOfTheMatchInfo(clubId, matchId, playerId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/updateManOfTheMatch?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId + '&playerId=' + playerId);
  }

  getParScoreData(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/getParScoreData?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  getParScoreBallbyBall(clubId, matchId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/dlParScoreBallByBall?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId);
  }

  updateRevisedTarget(data) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/updateRevisedDlDetails?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + data.clubId + '&matchId=' + data.matchId + '&revisedTarget=' + data.revisedTarget + '&revisedOvers=' + data.revisedOvers);
  }

  getDlTargetInning1(clubId, matchId, t1FinalScore) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/dlTargetInning1?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId + '&t1FinalScore=' + t1FinalScore);
  }

  saveChangeScorer(clubId, matchId, scorer) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/dlTargetInning1?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&matchId=' + matchId + '&scorer=' + scorer);
  }

  getClubPlayers(clubId, teamId, searchStr) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livescore/getClubPlayers?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&teamId=' + teamId + '&searchStr=' + searchStr);
  }

}
