import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  public headers = new HttpHeaders();

  constructor(public httpClient: HttpClient) {
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

  getMyLeagues() {
    console.log(localStorage);
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/mygame/my-clubs?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getMyGames() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/mygame/my-matches?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getMySchedule() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/mygame/my-schedules?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getLeagueDetails(clubId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/league/getLeagueDetails?clubId=' + clubId);
  }

  getNews(clubId, newsId?) {
    let params = '&clubId=' + clubId;
    if (newsId) { params += '&newsId=' + newsId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/media/getNews?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getArticles(clubId, articleId?) {
    let params = '&clubId=' + clubId;
    if (articleId) { params += '&articleId=' + articleId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/media/getArticles?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getAllSponsor(clubId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/sponsor/getAll?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId);
  }

  getLeaguePosts(clubId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/league/getPostsByLeaguePage?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId);
  }

  getSeriesList(clubId, limit?) {
    let params = '';
    if(limit)
      params = '&limit=' + limit;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/series/getSeriesList?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + params);
  }

  getTeamsList(clubId, seriesId) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/team/getTeamsList?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getLeagueMatchesResults(clubId, seriesId, teamId, limit?, offSet?) {
    let params = '&clubId=' + clubId;
    params += '&seriesId=' + seriesId;
    params += '&teamId=' + teamId;
    if (limit) { params += '&limit=' + limit };
    if (offSet) { params += '&offSet=' + offSet };

    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/match/getMatches?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getLeagueSchedules(clubId, seriesId, teamId, limit?) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    if (teamId) { params += '&teamId=' + teamId };
    if (limit) { params += '&limit=' + limit };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/match/getSchedule?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getPointsTable(clubId, seriesId, teamId?) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    if (teamId) { params += '&teamId=' + teamId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/team/getPointsTable?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getAlbums(clubId, teamId?) {
    let params = '&clubId=' + clubId;
    if (teamId) { params += '&teamId=' + teamId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/media/getAlbums?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getAlbumById(clubId, albumId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/media/getAlbumById?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&albumId=' + albumId);
  }

  getTeamPlayers(clubId, teamId) {
    let params = '&clubId=' + clubId;
    if (teamId) { params += '&teamId=' + teamId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/team/getTeamPlayers?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getAllTopStats(clubId, seriesId) {
    let params = '&clubId=' + clubId;
    params += '&seriesId=' + seriesId;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/stats/getAllTopStats?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getBattingStats(clubId, seriesId) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/stats/getBattingStats?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getBowlingStats(clubId, seriesId) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/stats/getBowlingStats?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getFeildingStats(clubId, seriesId) {
    let params = '&clubId=' + clubId;
    if (seriesId) { params += '&seriesId=' + seriesId };
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/stats/getFeildingStats?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  followUnfollowLeague(pageIdToFollow, action) {
    let params = '&pageIdToFollow=' + pageIdToFollow + '&action=' + action;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/league/followUnfollow?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getNotificationList() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/notification/getNotificationList?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getNotificationsCount() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/notification/getNotificationsCount?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  updateNotification(action, notificationId) {
    let params = '&action=' + action;
    if(notificationId > 0)
      params = params + '&notificationId=' + notificationId;
      
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/notification/updateNotification?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getSearchResults(searchText, searchCriteria, pageNum){
    let params = '&searchText=' + searchText;
    if (searchCriteria)
      params = params + '&searchCriteria=' + searchCriteria;

    // if (pageNum)
    //   params = params + '&pageNum=' + pageNum;

    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/search/getSearchResults?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }
  
  updatePlayerAvailability(fixtureId, playerId, clubId, status) {
    let params = '&clubId=' + clubId + '&fixtureId=' + fixtureId + '&playerAvailabilityStatus=' + status;
    if(playerId != 0)
      params = params  + '&playerId=' + playerId;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/createUpdatePlayerAvailableStatus?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getAvailabilityStatus(fixtureId, clubId){
    let params = '&clubId=' + clubId + '&fixtureId=' + fixtureId;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getAvailabilityStatus?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  finalizePlayingXI(clubId, fixtureId, data){
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/player/finalizePlayingXI?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&fixtureId=' + fixtureId, data, { headers: this.headers });
  }

  getInternationalMatches(){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/match/getInternationalMatches');
  }

  getSeriesDetails(clubId, seriesId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/series/getSeriesDetails?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&seriesId=' + seriesId);
  }

  createUpdateSeries(clubId, data, seriesId?) {
    let params = '&clubId=' + clubId;
    if (seriesId) {
      params = params + '&seriesId=' + seriesId;
    }
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/createUpdateSeries?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params, data, { headers: this.headers });
  }

  createUpdateTeam(clubId, seriesId, teamName, teamId?) {
    let params = '&clubId=' + clubId + '&seriesId=' + seriesId + '&teamName=' + teamName;
    if (teamId) {
      params = params + '&teamId=' + teamId;
    }
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/createUpdateTeam?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  deleteSeries(clubId, seriesId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/deleteSeries?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&seriesId=' + seriesId);
  }

  deleteTeam(clubId, teamId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/deleteTeam?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&teamId=' + teamId);
  }

  deletePlayerFromTeam(clubId, teamId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/deletePlayerFromTeam?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId + '&teamId=' + teamId, data, { headers: this.headers });
  }

  addPlayerToTeam(clubId, data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/admin/addPlayerToTeam?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + '&clubId=' + clubId, data, { headers: this.headers });
  }

}
