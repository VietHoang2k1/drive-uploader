const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.CLIENT_ID || '265989258511-cfl6g4epm1nae73pndhqldb0hv8hhc67.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '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'; 
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '1//049bkjk7_ravrCgYIARAAGAQSNwF-L9Ir8grAvaFyEq28Sh_F6CFxxMGWSqIW_7dNUI_E7aXstkcPYdIi0cZLbMWTiEPLGOy5Sik';
const FOLDER_ID = process.env.FOLDER_ID || '1deLcS1wvQAGEMNEiBbR6llA13KrVP0vU';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const uploadDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 300 * 1024 * 1024 }, // Giới hạn 300MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|pdf|docx|xlsx|mp3|mp4/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Định dạng không được hỗ trợ!'));
    }
});

app.use(express.json());
app.use(express.static('public'));

// 1. API Lấy dung lượng lưu trữ Google Drive
app.get('/storage-quota', async (req, res) => {
    try {
        const response = await drive.about.get({
            fields: 'storageQuota'
        });
        const quota = response.data.storageQuota;
        
        // Chuyển đổi bytes sang MB hoặc GB
        const limitBytes = parseInt(quota.limit || 0);
        const usageBytes = parseInt(quota.usage || 0);

        const limitGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(2);
        const usageGB = (usageBytes / (1024 * 1024 * 1024)).toFixed(2);
        const usagePercent = limitBytes > 0 ? ((usageBytes / limitBytes) * 100).toFixed(1) : 0;

        res.json({
            limit: limitGB + ' GB',
            usage: usageGB + ' GB',
            percent: usagePercent
        });
    } catch (error) {
        console.error('Lỗi lấy dung lượng:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin dung lượng.' });
    }
});

// 2. API Upload file lên Google Drive
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Upload thất bại hoặc file không hợp lệ.' });
    }

    try {
        const filePath = req.file.path;
        let originalName = req.file.originalname;
        try {
            originalName = Buffer.from(originalName, 'latin1').toString('utf8');
        } catch (e) {}
        
        const response = await drive.files.create({
            requestBody: {
                name: originalName,
                parents: [FOLDER_ID]
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(filePath)
            }
        });

        const fileId = response.data.id;

        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        fs.unlinkSync(filePath);
        res.json({ message: 'Tải lên Google Drive thành công!', fileId: fileId });
    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Lỗi khi tải lên Google Drive.' });
    }
});

// 3. API Lấy danh sách file từ Google Drive
app.get('/files', async (req, res) => {
    try {
        const response = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, size, webContentLink, webViewLink)',
            orderBy: 'createdTime desc'
        });

        const files = response.data.files.map(file => {
            let type = 'unknown';
            const mime = file.mimeType || '';
            if (mime.includes('image/')) type = 'jpg';
            else if (mime.includes('video/mp4')) type = 'mp4';
            else if (mime.includes('audio/mpeg')) type = 'mp3';
            else if (mime.includes('pdf') || mime.includes('document')) type = 'pdf';

            return {
                id: file.id,
                name: file.name,
                size: file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB',
                type: type,
                url: `https://drive.google.com/uc?export=download&id=${file.id}`,
                embedUrl: `https://drive.google.com/file/d/${file.id}/preview`
            };
        });

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Không thể lấy danh sách tệp từ Google Drive.' });
    }
});

// 4. API Xóa file trên Google Drive
app.delete('/files/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        await drive.files.delete({ fileId: fileId });
        res.json({ message: 'Đã xóa file thành công trên Google Drive!' });
    } catch (error) {
        console.error('Lỗi khi xóa file:', error);
        res.status(500).json({ error: 'Không thể xóa file trên Google Drive.' });
    }
});

// 5. API Tải nhiều file dưới dạng file ZIP
app.post('/download-zip', async (req, res) => {
    const { fileIds } = req.body; 
    if (!fileIds || !fileIds.length) {
        return res.status(400).json({ error: 'Chưa chọn file nào để tải.' });
    }

    res.attachment('download-files.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (const fileId of fileIds) {
        try {
            const fileMeta = await drive.files.get({ fileId: fileId, fields: 'name' });
            const fileName = fileMeta.data.name;
            const fileStream = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'stream' }
            );
            archive.append(fileStream.data, { name: fileName });
        } catch (err) {
            console.error(`Không thể nén file ${fileId}:`, err);
        }
    }

    archive.finalize();
});

app.listen(PORT, () => console.log(`Server chạy tại: http://localhost:${PORT}`));
