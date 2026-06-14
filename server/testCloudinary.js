import cloudinary from './config/cloudinary.js';

const runTest = async () => {
    try {
        console.log('Testing Cloudinary upload with credentials:');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
        console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
        
        // 1x1 pixel transparent PNG base64
        const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        
        const response = await cloudinary.uploader.upload(testImage);
        console.log('✅ Upload successful!', response.secure_url);
    } catch (error) {
        console.error('❌ Upload failed:', error.message || error);
    }
};

runTest();
