import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Reading } from './reading';
import { UserProfile } from './userprofile';
import { Alert } from './alert';
import { Device } from './device';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) { }
    rootURL = 'http://localhost:4000/api';
    public loginsubject$ = new Subject<string>();

    public readings$: Subject<Reading[]> = new Subject<Reading[]>();

    getReadings(deviceId: number, query: any) {
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

    postSubscription(subscription: any, deviceId: number) {
        return this.http.post(this.rootURL + '/subscriptions', subscription);
    }

    getSubscription(deviceId: number, query: any) {
        return this.http.get<Reading[]>(this.rootURL + '/readings/' + deviceId + '?' + this.serialize(query));
    }

    postUserProfile(userprofile: any) {
        return this.http.post<UserProfile>(this.rootURL + '/userprofiles', userprofile);
    }

    login(username: string, password: string) {
        return this.http.post<UserProfile>(this.rootURL + '/login', { username, password });
    }
    
    postAlert(deviceId: any, userId: any, unitLimit: any, alertType: any) {
        return this.http.post(this.rootURL + '/alerts', { deviceId, userId, unitLimit, alertType });
    }

    getAlerts(deviceId: number, query: any) {
        return this.http.get<Alert[]>(this.rootURL + '/alerts/' + deviceId + '?' + this.serialize(query));
    }    
    
    postDevice(userId: any, deviceId: any, deviceName: any, createdDate: any) {
        return this.http.post<Device>(this.rootURL + '/devices', { userId, deviceId, deviceName, createdDate });
    }

    getDevices(userId: string, query: any) {
        return this.http.get<Device[]>(this.rootURL + '/devices/' + userId + '?' + this.serialize(query));
    }

    deleteDevice(id: string) {
        return this.http.delete(this.rootURL + '/devices/' + id);
    }
}