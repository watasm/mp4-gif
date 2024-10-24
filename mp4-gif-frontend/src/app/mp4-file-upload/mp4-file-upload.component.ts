import { Component } from '@angular/core';
import { FileUploadService } from './file-upload-service';

@Component({
  selector: 'app-mp4-file-upload',
  templateUrl: './mp4-file-upload.component.html',
  styleUrls: ['./mp4-file-upload.component.css']
})
export class Mp4FileUploadComponent {
  selectedFile: File | null = null;
  progress: number = 0;
  gifUrl: string | null = null;
  validationError: string | null = null;

  constructor(private fuService: FileUploadService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      this.validateFile(file);
    }
  }

  validateFile(file: File): void {
    const video = document.createElement('video'); 
    const objectURL = URL.createObjectURL(file);    

    video.src = objectURL;  
    video.preload = 'metadata';  

    video.onloadedmetadata = () => {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const videoDuration = video.duration;

      if (videoWidth > 1024 || videoHeight > 768) {
        this.validationError = 'Error: Video dimensions exceed 1024x768.';
        this.selectedFile = null;  
      } 
      else if (videoDuration > 10) {
        this.validationError = 'Error: Video duration exceeds 10 seconds.';
        this.selectedFile = null;  
      } 
      else {
        this.validationError = null;
        this.selectedFile = file;
      }

      URL.revokeObjectURL(objectURL);
    };
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.fuService.uploadFile(this.selectedFile).subscribe({
        next: (event) => {
          if (event.status === 'progress') {
            this.progress = event.progress;
          } else if (event.status === 'completed') {
            this.gifUrl = event.gifUrl;
          }
        },
        error: (err) => {
          console.error('Upload failed:', err);
        }
      });
    }
  }
}
