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
    console.log("Fetching Homepage Data from:", `${this.apiUrl}/homepage`);
    return this.http.get<any>(`${this.apiUrl}/homepage`).pipe(
      map(response => {
        console.log("Homepage API Response:", response);
        return Array.isArray(response) ? response[0]?.acf : response.acf;
      })
    );
  }

  getOfficeData(): Observable<any> {
    console.log("Fetching Office Data from:", `${this.apiUrl}/office`);
    return this.http.get<any>(`${this.apiUrl}/office`).pipe(
      map(response => {
        console.log("Office API Response:", response);
        return Array.isArray(response) ? response[0]?.acf : response.acf;
      })
    );
  }

  getSkillsData(): Observable<any> {
    console.log("Fetching Skills Data from:", `${this.apiUrl}/skills`);
    return this.http.get<any>(`${this.apiUrl}/skills`).pipe(
      map(response => {
        console.log("Skills API Response:", response);
        return Array.isArray(response) && response.length > 0 ? response[0] : response;
      })
    );
  }

  getSelectedLawyersData(): Observable<any> {
    console.log("Fetching Selected Lawyers Data from:", `${this.apiUrl}/selected_lawyer`);
    return this.http.get<any>(`${this.apiUrl}/selected_lawyer`).pipe(
      map(response => {
        console.log("Selected Lawyers API Response:", response);
        return Array.isArray(response) ? response.map((item: any) => item.acf) : [];
      })
    );
  }

  getTeamData(): Observable<any> {
    console.log("Fetching Team Data from:", `${this.apiUrl}/team`);
    return this.http.get<any>(`${this.apiUrl}/team`).pipe(
      map(response => {
        console.log("Team API Response:", response);
        return Array.isArray(response) ? response.map((item: any) => item.acf) : [];
      })
    );
  }

  getContactData(): Observable<any> {
    console.log("Fetching Contact Data from:", `${this.apiUrl}/contact`);
    return this.http.get<any>(`${this.apiUrl}/contact`).pipe(
      map(response => {
        console.log("Contact API Response:", response);
        return Array.isArray(response) ? response[0]?.acf : response.acf;
      })
    );
  }

  getAuctionsData(): Observable<any> {
    console.log("Fetching Auctions Data from:", `${this.apiUrl}/auctions`);
    return this.http.get<any>(`${this.apiUrl}/auctions`).pipe(
      map(response => {
        console.log("Auctions API Response:", response);
        return Array.isArray(response) ? response.map((item: any) => item.acf) : [];
      })
    );
  }

  getSelectedAuctionData(): Observable<any> {
    console.log("Fetching Selected Auction Data from:", `${this.apiUrl}/selected_auction`);
    return this.http.get<any>(`${this.apiUrl}/selected_auction`).pipe(
      map(response => {
        console.log("Selected Auction API Response:", response);
        return Array.isArray(response) ? response[0]?.acf : response.acf;
      })
    );
  }

  getPostById(id: number): Observable<any> {
    console.log("Fetching Post by ID:", `${this.apiUrl}/wp-json/wp/v2/posts/${id}`);
    return this.http.get<any>(`${this.apiUrl}/wp-json/wp/v2/posts/${id}`).pipe(
      map(response => {
        console.log("Post API Response:", response);
        return response;
      })
    );
  }
}
