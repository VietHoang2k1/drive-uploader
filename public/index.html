<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Google Drive Pro</title>
    <!-- Sử dụng Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-8 px-4 flex flex-col justify-between">
    <div class="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 mb-6">
        
        <!-- Tiêu đề -->
        <h1 class="text-3xl font-extrabold text-slate-800 mb-6 text-center tracking-tight">
            🚀 Quản Lý Google Drive Pro
        </h1>

        <!-- KHU VỰC HIỂN THỊ DUNG LƯỢNG -->
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm mb-6">
            <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-slate-700 text-sm md:text-base flex items-center gap-2">
                    📊 Dung lượng Drive:
                </span>
                <span id="storage-text" class="text-xs md:text-sm font-bold text-blue-600">Đang tải...</span>
            </div>
            <!-- Thanh tiến trình (Progress Bar) -->
            <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div id="storage-bar" class="bg-blue-600 h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>
        </div>

        <!-- KHU VỰC UPLOAD FILE -->
        <div class="mb-8 border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center bg-blue-50/50 hover:bg-blue-50/80 transition">
            <div class="flex flex-col items-center justify-center space-y-3">
                <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <input type="file" id="fileInput" class="text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
                <button onclick="uploadFile()" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 shadow-md transition active:scale-95">
                    Bắt đầu tải lên
                </button>
                <p id="uploadStatus" class="text-sm font-semibold text-slate-600 min-h-[20px]"></p>
            </div>
        </div>

        <hr class="mb-6 border-slate-200">

        <!-- KHU VỰC THAO TÁC DANH SÁCH FILE -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h2 class="text-xl font-bold text-slate-700">📂 Kho Tệp Trên Drive</h2>
            
            <!-- Nhóm nút chức năng hàng loạt (Đã lược bỏ nút tải zip) -->
            <div class="flex flex-wrap gap-2">
                <button onclick="deleteSelectedFiles()" class="bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-rose-600 shadow transition active:scale-95">
                    🗑️ Xóa đã chọn
                </button>
                <button onclick="deleteAllFiles()" class="bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-red-700 shadow transition active:scale-95">
                    🔥 Xóa tất cả
                </button>
            </div>
        </div>

        <!-- BẢNG HIỂN THỊ FILE -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
                        <th class="p-3 text-center w-12"><input type="checkbox" id="selectAll" onclick="toggleSelectAll(this)" class="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"></th>
                        <th class="p-3">Tên tệp</th>
                        <th class="p-3 text-center w-36">Hành động</th>
                    </tr>
                </thead>
                <tbody id="fileTableBody" class="text-slate-600 text-sm divide-y divide-slate-200 bg-white">
                    <!-- Danh sách file sẽ được load tự động vào đây -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- FOOTER LƯU Ý -->
    <footer class="text-center text-slate-500 text-xs md:text-sm pb-4">
        📌 <span class="font-semibold text-slate-600">Lưu ý:</span> Đây là bản free, muốn tải nhiều file liên hệ với admin.
    </footer>

    <script>
        let allFilesCache = []; // Lưu trữ danh sách file toàn cục

        async function loadStorageQuota() {
            try {
                const res = await fetch('/storage-quota');
                const data = await res.json();
                if (res.ok) {
                    document.getElementById('storage-text').innerText = `${data.usage} / ${data.limit} (${data.percent}%)`;
                    document.getElementById('storage-bar').style.width = `${data.percent}%`;
                } else {
                    document.getElementById('storage-text').innerText = 'Không thể tải dung lượng';
                }
            } catch (err) {
                console.error(err);
                document.getElementById('storage-text').innerText = 'Lỗi kết nối';
            }
        }

        async function loadFiles() {
            try {
                const res = await fetch('/files');
                const files = await res.json();
                allFilesCache = files; 
                const tbody = document.getElementById('fileTableBody');
                tbody.innerHTML = '';

                if (files.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="3" class="text-center p-6 text-slate-400 italic">Chưa có tệp nào trên Drive.</td></tr>`;
                    return;
                }

                files.forEach(file => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-50 transition';
                    tr.innerHTML = `
                        <td class="p-3 text-center"><input type="checkbox" class="file-checkbox" value="${file.id}"></td>
                        <td class="p-3 font-medium text-slate-800 break-all">${file.name}</td>
                        <td class="p-3 text-center space-x-3">
                            <a href="https://drive.google.com/uc?export=download&id=${file.id}" class="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2.5 py-1.5 rounded-lg transition">Tải</a>
                            <button onclick="deleteSingleFile('${file.id}')" class="text-rose-600 hover:text-rose-800 font-medium text-xs bg-rose-50 px-2.5 py-1.5 rounded-lg transition">Xóa</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } catch (err) {
                console.error("Lỗi khi load tệp:", err);
            }
        }

        function toggleSelectAll(source) {
            const checkboxes = document.querySelectorAll('.file-checkbox');
            checkboxes.forEach(cb => cb.checked = source.checked);
        }

        async function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            const statusText = document.getElementById('uploadStatus');
            if (fileInput.files.length === 0) {
                alert('Vui lòng chọn một file trước!');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            statusText.innerText = '⏳ Đang tải lên Google Drive...';
            statusText.className = "text-sm font-semibold text-blue-600 mt-2";

            try {
                const res = await fetch('/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (res.ok) {
                    statusText.innerText = '✨ Tải lên thành công!';
                    statusText.className = "text-sm font-semibold text-emerald-600 mt-2";
                    fileInput.value = '';
                    loadFiles();
                    loadStorageQuota();
                } else {
                    statusText.innerText = '❌ Lỗi: ' + data.error;
                    statusText.className = "text-sm font-semibold text-rose-600 mt-2";
                }
            } catch (err) {
                statusText.innerText = '❌ Lỗi kết nối đến server!';
                statusText.className = "text-sm font-semibold text-rose-600 mt-2";
            }
        }

        async function deleteSingleFile(fileId) {
            if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn file này không?')) return;

            try {
                const res = await fetch(`/files/${fileId}`, { method: 'DELETE' });
                if (res.ok) {
                    loadFiles();
                    loadStorageQuota();
                } else {
                    alert('Xóa file thất bại.');
                }
            } catch (err) {
                alert('Lỗi kết nối server.');
            }
        }

        async function deleteSelectedFiles() {
            const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('Vui lòng chọn ít nhất một file để xóa.');
                return;
            }

            if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn ${selectedCheckboxes.length} file đã chọn?`)) return;

            for (const cb of selectedCheckboxes) {
                await fetch(`/files/${cb.value}`, { method: 'DELETE' });
            }

            loadFiles();
            loadStorageQuota();
        }

        async function deleteAllFiles() {
            if (allFilesCache.length === 0) {
                alert('Kho Drive đang trống!');
                return;
            }

            if (!confirm(`🔥 CẢNH BÁO: Bạn có chắc chắn muốn XÓA TẤT CẢ ${allFilesCache.length} file trên Google Drive không?`)) return;

            for (const file of allFilesCache) {
                await fetch(`/files/${file.id}`, { method: 'DELETE' });
            }

            loadFiles();
            loadStorageQuota();
        }

        loadStorageQuota();
        loadFiles();
    </script>
</body>
</html>
