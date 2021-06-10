import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public headers = new HttpHeaders();

  constructor(public httpClient: HttpClient) {
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

  userLogin(data): Observable<object> {
    return this.httpClient.get('country/states?countryCode=' + data);
  }

    // post a request to login user - calling API web services
  loginUser(loginObject) {
    // call post end point
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/login?username=' + encodeURIComponent(loginObject.userName) + '&password=' + encodeURIComponent(loginObject.password));
  }

  followUnfollowUser(userId, action){
    let params = '&userIdToFollow=' + userId + '&action=' + action;
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/follow?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + params);
  }

  getPlayerDetails(userId, isAuthToken?) {
    if (isAuthToken) {
      // fetch by auth token
      return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getDetails?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
    } else {
      // fetch by userId
      return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getDetails?userId=' + userId);
    }
  }

  getFriendsList() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/getFriendsList?X-Auth-Token=' + localStorage.getItem('X-Auth-Token'));
  }

  getMyGameMyMatches(playerId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/mygame/my-matches?playerId=' + playerId);
  }

  getStats(playerId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getStats?playerId=' + playerId);
  }

  getChart(playerId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getChart?playerId=' + playerId);
  }

  getImages(playerId) {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/player/getImages?playerId=' + playerId);
  }

  getCountries() {
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/country/getAllCountries');
  }

  registerUser(data) {
    return this.httpClient.post(CONSTANTS.API_ENDPOINT + 'CCAPI/user/submitRegistrationForm',
      data,
      { headers: this.headers }
    );
  }

  sendOTP(userId, otp){
    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/user/submitRegistrationOTP?userId=' + userId + '&otp=' + otp);
  }
}
