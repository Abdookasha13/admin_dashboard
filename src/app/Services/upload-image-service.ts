import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private cloudName = 'dy8q8wegg';
  private uploadPreset = 'unsigned_users_upload';

  constructor() {}

  async uploadImage(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}
