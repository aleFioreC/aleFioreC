import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {

    environment: string;

    constructor(private httpClient: HttpClient) {
        this.environment = environment.base_url
        console.log(this.environment)
    }

    allNews() {
        return this.httpClient.get(this.environment + 'news/findAll');
    }

    getNews(id: string) {
        return this.httpClient.get(this.environment + 'news/findById?=' + id);
    }

    allAuthor() {
        return this.httpClient.get(this.environment + 'author/findAll');
    }

    saveNews(body: any) {
        return this.httpClient.post(this.environment + 'news/save', body);
    }

    login(body: any) {
        return this.httpClient.post(this.environment + 'login', body);
    }

}