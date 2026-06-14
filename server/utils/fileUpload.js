import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveBase64Image = (base64String) => {
  try {
    // Determine the path to the public/uploads directory
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Extract the image format and base64 data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }

    const type = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Generate a unique filename
    const filename = `image-${Date.now()}.${type === 'jpeg' ? 'jpg' : type}`;
    const filePath = path.join(uploadDir, filename);

    // Save the file
    fs.writeFileSync(filePath, buffer);

    // Return the URL path
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving local file:', error);
    throw new Error('Failed to save image locally');
  }
};
