const DB_URL = "https://doanquang-default-rtdb.firebaseio.com/scams.json";

// Hàm Kiểm tra
async function checkScam() {
    const input = document.getElementById('phoneInput').value.trim();
    const result = document.getElementById('resultMessage');
    if (!input) return;

    result.style.display = "block";
    result.className = "status-box";
    result.textContent = "⌛ Đang tra cứu...";

    const cleanInput = input.replace(/[\s\-\.]/g, '').toLowerCase();

    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        const scams = data ? Object.values(data) : [];
        const isScam = scams.find(s => s.value === cleanInput);

        if (isScam) {
            result.className = "status-box warning";
            result.textContent = `⚠️ CẢNH BÁO: ${input} là lừa đảo (${isScam.type})!`;
        } else {
            result.className = "status-box safe";
            result.textContent = `✅ Dữ liệu ${input} hiện chưa bị báo cáo.`;
        }
    } catch (e) {
        result.textContent = "❌ Lỗi kết nối Database.";
    }
}

// Hàm Cập nhật
async function updateScam() {
    const input = document.getElementById('updateInput').value.trim();
    const status = document.getElementById('updateStatus');
    if (!input) return;

    const cleanInput = input.replace(/[\s\-\.]/g, '').toLowerCase();
    let type = input.includes("@") ? "Email" : (isNaN(cleanInput) ? "Khác" : "SĐT/STK");

    status.style.display = "block";
    status.textContent = "⌛ Đang gửi...";

    try {
        await fetch(DB_URL, {
            method: 'POST',
            body: JSON.stringify({ type: type, value: cleanInput, date: new Date().toLocaleString() })
        });
        status.className = "status-box safe";
        status.textContent = "✅ Đã cập nhật thành công!";
        document.getElementById('updateInput').value = "";
    } catch (e) {
        status.textContent = "❌ Lỗi khi gửi dữ liệu.";
    }
}

document.getElementById('checkButton').onclick = checkScam;
document.getElementById('updateButton').onclick = updateScam;