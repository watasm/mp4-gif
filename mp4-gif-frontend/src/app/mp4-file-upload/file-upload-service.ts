import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class FileUploadService {
    private uploadUrl = 'http://localhost:3000/convert';

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('video', file);

        return this.http.post(this.uploadUrl, formData, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        }).pipe(
            map(event => {
                switch(event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                        return { status: 'progress', progress };

                    case HttpEventType.Response:
                        const gifBlob = event.body;
                        if (gifBlob) {
                            const gifUrl = URL.createObjectURL(gifBlob);
                            return { status: 'completed', gifUrl };
                          } else {
                            throw new Error('No GIF file returned by the server');
                          }
                    default:
                        return { status: 'event', event };
                }
            })
        )
    }
}