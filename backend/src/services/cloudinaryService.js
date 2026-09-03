import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { logger } from '../utils/logger.js';

export const cloudinaryService = {
  /**
   * Upload buffer directly to Cloudinary using Node.js native Readable stream
   */
  async uploadStream(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: options.resource_type || 'auto',
          folder: options.folder || 'portfolio',
          ...options,
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary stream upload error:', error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type,
          });
        }
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  },

  /**
   * Safe asset deletion from Cloudinary
   */
  async deleteAsset(publicId, resourceType = 'image') {
    if (!publicId) return { success: true };
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
      logger.info(`Deleted Cloudinary asset [${publicId}]:`, result.result);
      return { success: result.result === 'ok' || result.result === 'not found' };
    } catch (err) {
      logger.error(`Failed to delete Cloudinary asset [${publicId}]:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Safe replacement flow:
   * Upload new file first -> if success, delete old asset.
   */
  async replaceAsset(buffer, oldPublicId, options = {}) {
    // 1. Upload new asset
    const newAsset = await this.uploadStream(buffer, options);

    // 2. Safely destroy old asset if present
    if (oldPublicId) {
      this.deleteAsset(oldPublicId, options.resource_type || 'image').catch((e) =>
        logger.warn('Non-blocking cleanup warning:', e.message)
      );
    }

    return newAsset;
  },
};
