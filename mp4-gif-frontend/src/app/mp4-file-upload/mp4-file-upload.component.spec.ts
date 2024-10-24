import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mp4FileUploadComponent } from './mp4-file-upload.component';

describe('Mp4FileUploadComponent', () => {
  let component: Mp4FileUploadComponent;
  let fixture: ComponentFixture<Mp4FileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Mp4FileUploadComponent]
    });
    fixture = TestBed.createComponent(Mp4FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
