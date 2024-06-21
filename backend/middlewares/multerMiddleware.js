import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const ensureDirectoryExistence = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', '..', 'frontend', 'app', 'public', 'assets', 'images', 'uploads');
        ensureDirectoryExistence(uploadDir);
        cb(null, uploadDir); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        // Generate the filename using the user ID and original filename
        const userId = req.user.userId; // Assuming userId is available in req.user
        const originalFileName = file.originalname;
        const fileName = `${userId}${originalFileName}`; // Combine userId and original filename
        cb(null, fileName);
    }
});

// Initialize multer upload with the storage configuration
const upload = multer({ storage: storage }).single('testImage');

export default upload;
