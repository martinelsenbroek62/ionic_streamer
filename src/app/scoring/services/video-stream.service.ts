import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class VideoStreamService {

  constructor(public httpClient: HttpClient) { }

  getLiveStreamDetails(match: any, deviceId?: any) {
    // const clubId = localStorage.getItem('clubId');
    // const clubId = 50;

    let paramString = '&fixtureId=' + match.fixtureId + '&clubId=' + match.clubId;
    if (match.channel) { paramString = paramString + '&channel=' + match.channel };
    if (deviceId) { paramString = paramString + '&deviceId=' + deviceId };

    return this.httpClient.get(CONSTANTS.API_ENDPOINT + 'CCAPI/scoring/livestream/create-youtube-stream?X-Auth-Token=' + localStorage.getItem('X-Auth-Token') + paramString);
  }

  /*
  getLiveScores(clubId, matchId) {
    // clubId=16&matchId=1871
    const paramString = 'clubId=' + clubId + '&matchId=' + matchId;

    // fetch live score by clubId and matchId
    return this.httpClient.get('https://cricclubs.com/liveScoreOverlayData.do?' + paramString);
  }

  sendLiveStreamToYoutubeHLS(object) {
    const API_ENDPOINT = 'https://www.googleapis.com/upload/youtube/v3/videos?access_token=' + object.ACCESS_TOKEN;

    const header: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer ' + object.ACCESS_TOKEN)
    .set('Accept', 'application/octet-stream')
    .set('Content-Type', 'application/octet-stream');

    // call post end point
    return this.httpClient.post(
      API_ENDPOINT,
      object,
      { headers: header }
    );
  }

  sendLiveStreamToYoutube(file) {
    // POST https://www.googleapis.com/youtube/v3/liveStreams?part=snippet%2Ccdn%2CcontentDetails%2Cstatus&key=[YOUR_API_KEY] HTTP/1.1

    const API_KEY = 'AIzaSyDfYdRd_PvRbhrhbtlUTsijIRGOXZWLzQg';
    const YOUR_ACCESS_TOKEN = 'AIzaSyDfYdRd_PvRbhrhbtlUTsijIRGOXZWLzQg';

    const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/liveStreams';

    const header: HttpHeaders = new HttpHeaders()
    .set('Authorization', YOUR_ACCESS_TOKEN)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

    const object = {
      "snippet": {
        "title": "Your new video stream's name",
        "description": "A description of your video stream. This field is optional."
      },
      "cdn": {
        "frameRate": "60fps",
        "ingestionType": "hls",
        "resolution": "1080p"
      },
      "contentDetails": {
        "isReusable": true
      },
      file,
      key: API_KEY
    };

    // call post end point
    return this.httpClient.post(
      API_ENDPOINT,
      object,
      { headers: header }
    );
  }
  */
}
