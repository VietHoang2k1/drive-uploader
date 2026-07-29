// Tải các file đã chọn (Mở link tải trực tiếp từ Google Drive)
function downloadSelectedZip() {
    const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn ít nhất một file để tải.');
        return;
    }

    const statusText = document.getElementById('uploadStatus');
    statusText.innerText = `🚀 Đang mở tải xuống ${selectedCheckboxes.length} file...`;
    statusText.className = "text-sm font-semibold text-blue-600 mt-2";

    // Lần lượt mở link tải trực tiếp cho từng file đã chọn
    selectedCheckboxes.forEach((cb, index) => {
        const fileId = cb.value;
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        // Dùng setTimeout nhỏ để tránh bị trình duyệt chặn bật nhiều cửa sổ cùng lúc (Pop-up blocker)
        setTimeout(() => {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }, index * 300); // Mỗi file cách nhau 300ms
    });

    setTimeout(() => {
        statusText.innerText = '✨ Đã kích hoạt tải xuống thành công!';
        statusText.className = "text-sm font-semibold text-emerald-600 mt-2";
    }, selectedCheckboxes.length * 300);
}

// Tải tất cả các file có trên Drive (Mở link tải trực tiếp)
function downloadAllZip() {
    if (allFilesCache.length === 0) {
        alert('Kho Drive đang trống!');
        return;
    }

    const statusText = document.getElementById('uploadStatus');
    statusText.innerText = `🚀 Đang mở tải xuống toàn bộ ${allFilesCache.length} file...`;
    statusText.className = "text-sm font-semibold text-blue-600 mt-2";

    allFilesCache.forEach((file, index) => {
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
        
        setTimeout(() => {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }, index * 300);
    });

    setTimeout(() => {
        statusText.innerText = '✨ Đã kích hoạt tải xuống tất cả thành công!';
        statusText.className = "text-sm font-semibold text-emerald-600 mt-2";
    }, allFilesCache.length * 300);
}
