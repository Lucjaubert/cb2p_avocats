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


  getAllAuctionsSummary(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/auctions`).pipe(
      map((res) => {
        if (!res || res.length === 0 || !res[0].acf) return [];

        const acf = res[0].acf;

        const items = [];

        // Supposons qu’on ait jusqu’à 10 ventes (à adapter dynamiquement si besoin)
        for (let i = 1; i <= 10; i++) {
          const title = acf[`title_sale_id_${i}`];
          const subtitle = acf[`subtitle_sale_id_${i}`];
          const description = acf[`selected_text_id_${i}`] || '';
          const image = acf[`image_1_sale_id_${i}`] || acf[`image_sale_id_${i}`] || '';
          const price = this.extractPriceFromSubtitle(subtitle);

          if (title || description || image) {
            items.push({
              id: i, // ✅ très important : cet ID sera passé à getAuctionDetailsByIndex(i)
              title,
              description,
              image,
              price
            });
          }
        }

        return {
          title: acf[`title_id_1`] || '',
          subtitle: acf[`subtitle_id_1`] || '',
          items
        };
      })
    );
  }

  private extractPriceFromSubtitle(subtitle: string): string | null {
    const match = subtitle?.match(/mise à prix\s*:?\s*([\d\s]+(?:€|euros)?)/i);
    return match ? match[1].trim() : null;
  }



  getAuctionDetailsByIndex(i: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions`).pipe(
      map((res: any) => {
        if (!res || !Array.isArray(res) || !res[0]?.acf) return null;
        const acf = res[0].acf;

        return {
          title: acf[`selected_title_id_${i}`] || '',
          subtitle: acf[`selected_subtitle_id_${i}`] || '',
          text: acf[`selected_text_id_${i}`] || '',
          info: acf[`selected_info_id_${i}`] || '',
          pdf: acf[`pv_descriptif_auction_id_${i}`] || acf[`pv_descriptif_auction_${i}`] || '',
          cahier: acf[`cahier_vente_auction_id_${i}`] || '',
          dtt: acf[`dtt_auction_id_${i}`] || '',
          bail: acf[`bail_auction_id_${i}`] || '',
          certificat: acf[`certificat_auction_id_${i}`] || '',
          frais: acf[`frais_auction_id_${i}`] || '',
          affiche: acf[`affiche_auction_id_${i}`] || '',
          image:
            acf[`image_1_sale_id_${i}`] ||
            acf[`image_sale_id_${i}`] ||
            '',
          gallery: Array.from({ length: 10 }, (_, index) => acf[`image_${index + 1}_sale_id_${i}`]).filter(Boolean)
        };
      })
    );
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wp-json/wp/v2/posts/${id}`).pipe(
      map(response => response)
    );
  }

  sendContactMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/wp-json/cb2p/v1/send-message`, data);
  }

  verifyRecaptcha(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/wp-json/cb2p/v1/verify-recaptcha`, { token });
  }
}
