import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Reading } from './reading';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) { }
    rootURL = 'http://localhost:4000/api';

    public readings$: Subject<Reading[]> = new Subject<Reading[]>();

    getReadings(deviceId: string, query: any) {
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

    postSubscription(subscription: any, deviceId: string) {
        return this.http.post(this.rootURL + '/subscriptions', subscription);
    }

    getSubscription(deviceId: string, query: any) {
        return this.http.get<Reading[]>(this.rootURL + '/readings/' + deviceId + '?' + this.serialize(query));
    }
}