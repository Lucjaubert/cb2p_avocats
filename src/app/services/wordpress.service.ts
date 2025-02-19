import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  private apiUrl = environment.apiUrl;

  private skillsData: any = null;

  constructor(private http: HttpClient) {}

  getHomepageData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/homepage`).pipe(
      map(response => response[0]?.acf)
    );
  }

  getOfficeData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/office`).pipe(
      map(response => response[0]?.acf)
    );
  }

  getSkillsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/skills`).pipe(
      map(response => {
        const item = Array.isArray(response) && response.length > 0 ? response[0] : null;
        return item;
      })
    );
  }

  getSelectedLawyersData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/selected_lawyer`).pipe(
      map(response => response.map((item: any) => item.acf))
    );
  }

  getTeamData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team`).pipe(
      map(response => response.map((item: any) => item.acf))
    );
  }

  getContactData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/contact`).pipe(
      map(response => response[0]?.acf)
    );
  }

  getAuctionsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auctions`).pipe(
      map(response => response.map((item: any) => item.acf))
    );
  }

  getSelectedAuctionData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/selected_auction`).pipe(
      map(response => response[0]?.acf)
    );
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wp-json/wp/v2/posts/${id}`).pipe(
      map(response => response)
    );
  }
}
