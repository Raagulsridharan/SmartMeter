import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reading } from './reading';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) { }
    rootURL = '/api';
    getReadings(): Observable<Reading[]> {
        return this.http.get<Reading[]>(this.rootURL + '/readings');
    }
}