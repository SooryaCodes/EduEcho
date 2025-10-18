import cloudinary, { CLOUDINARY_CONFIG } from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export class CloudinaryService {
  /**
   * Upload audio file to Cloudinary
   */
  async uploadAudio(buffer: Buffer, filename: string): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_CONFIG.AUDIO_FOLDER,
            resource_type: 'video', // Cloudinary treats audio as video
            public_id: `${uuidv4()}-${filename}`,
            format: 'mp3',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Upload failed'));
            }
          }
        );

        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload audio file');
    }
  }

  /**
   * Delete audio file from Cloudinary
   */
  async deleteAudio(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
      });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Get audio URL from public ID
   */
  getAudioUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      secure: true,
    });
  }
}

export default new CloudinaryService();

