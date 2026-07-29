const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const { Readable } = require('stream');

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình Multer lưu file tạm vào bộ nhớ RAM
const upload = multer({ storage: multer.memoryStorage() });

// Xác thực Google Drive API bằng biến môi trường GOOGLE_CREDENTIALS (chứa toàn bộ file JSON)
let credentials;
try {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} catch (error) {
    console.error("Lỗi: Biến môi trường GOOGLE_CREDENTIALS chưa được thiết lập hoặc không đúng định dạng JSON!");
}

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

// 1. API lấy dung lượng Drive (Storage Quota)
app.get('/storage-quota', async (req, res) => {
    try {
        const about = await drive.about.get({
            fields: 'storageQuota',
        });
        const quota = about.data.storageQuota;
        
        const limitBytes = parseInt(quota.limit || 0);
        const usageBytes = parseInt(quota.usageInDrive || 0);

        const limitGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(2);
        const usageMB = (usageBytes / (1024 * 1024)).toFixed(2);
        const usageGB = (usageBytes / (1024 * 1024 * 1024)).toFixed(2);

        const usageFormatted = limitBytes > 0 && limitGB >= 1 ? `${usageGB} GB` : `${usageMB} MB`;
        const limitFormatted = limitBytes > 0 ? `${limitGB} GB` : 'Không giới hạn';
        const percent = limitBytes > 0 ? ((usageBytes / limitBytes) * 100).toFixed(1) : 0;

        res.json({
            usage: usageFormatted,
            limit: limitFormatted,
            percent: percent
        });
    } catch (err) {
        console.error('Lỗi lấy storage quota:', err);
        res.status(500).json({ error: 'Không thể lấy dung lượng Drive' });
    }
});

// 2. API lấy danh sách thư mục và file trong một thư mục cụ thể (Đã sửa lỗi orderBy)
app.get('/files', async (req, res) => {
    try {
        const folderId = req.query.folderId || 'root';
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, size)',
            orderBy: 'name', // Sắp xếp theo tên chuẩn xác
        });
        res.json(response.data.files);
    } catch (err) {
        console.error('Lỗi lấy danh sách file:', err);
        res.status(500).json({ error: 'Không thể lấy danh sách tệp' });
    }
});

// 3. API tạo thư mục mới
app.post('/folders', async (req, res) => {
    try {
        const { name, parentId } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Tên thư mục không được để trống!' });
        }

        const folderMetadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId || 'root']
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id, name, mimeType',
        });

        res.json({ success: true, folder: folder.data });
    } catch (err) {
        console.error('Lỗi tạo thư mục:', err);
        res.status(500).json({ error: 'Không thể tạo thư mục trên Google Drive' });
    }
});

// 4. API tải lên file (Hỗ trợ upload vào thư mục hiện tại)
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Chưa có file nào được chọn!' });
        }

        const folderId = req.body.folderId || 'root';
        const fileMetadata = {
            name: req.file.originalname,
            parents: [folderId]
        };

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const response = await drive.files.create({
            resource: fileMetadata,
            media: {
                mimeType: req.file.mimetype,
                body: bufferStream,
            },
            fields: 'id, name',
        });

        res.json({ success: true, file: response.data });
    } catch (err) {
        console.error('Lỗi upload file:', err);
        res.status(500).json({ error: 'Lỗi khi tải lên Google Drive' });
    }
});

// 5. API xóa file hoặc thư mục
app.delete('/files/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        await drive.files.delete({ fileId: fileId });
        res.json({ success: true });
    } catch (err) {
        console.error('Lỗi xóa file:', err);
        res.status(500).json({ error: 'Không thể xóa tệp' });
    }
});

app.listen(port, () => {
    console.log(`Server chạy tại: http://localhost:${port}`);
});
