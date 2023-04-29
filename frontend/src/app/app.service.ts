import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reading } from './reading';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) { }
    rootURL = 'http://localhost:4000/api';
    getReadings(deviceId: string, query: any): Observable<Reading[]> {
        return this.http.get<Reading[]>(this.rootURL + '/readings/' + deviceId + '?' + this.serialize(query));
    }

    serialize(obj: any) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }
}