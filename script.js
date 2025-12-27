// Cấu hình Base URL (bỏ đuôi scams.json cũ)
const BASE_URL = "https://doanquang-default-rtdb.firebaseio.com/";

// 1. HÀM KIỂM TRA LỪA ĐẢO
async function checkScam() {
    const input = document.getElementById('phoneInput').value.trim();
    const result = document.getElementById('resultMessage');
    
    if (!input) return;

    result.style.display = "block";
    result.className = "status-box";
    result.textContent = "⌛ Đang tra cứu danh sách chính thức...";

    const cleanInput = input.replace(/[\s\-\.]/g, '').toLowerCase();

    try {
        // CHỈ LẤY DỮ LIỆU TỪ MỤC 'scams' (Dữ liệu đã duyệt)
        const response = await fetch(`${BASE_URL}scams.json`);
        const data = await response.json();
        const scams = data ? Object.values(data) : [];
        
        const isFound = scams.find(s => s.value === cleanInput);

        if (isFound) {
            result.className = "status-box warning";
            result.innerHTML = `⚠️ CẢNH BÁO: ${input} là lừa đảo (${isFound.type})!`;
        } else {
            result.className = "status-box safe";
            result.innerHTML = `✅ Dữ liệu ${input} hiện an toàn (hoặc đang chờ duyệt).`;
        }
    } catch (e) {
        result.textContent = "❌ Lỗi kết nối Database.";
    }
}

// 2. HÀM ĐÓNG GÓP DỮ LIỆU (GỬI VÀO MỤC CHỜ DUYỆT)
async function updateScam() {
    const input = document.getElementById('updateInput').value.trim();
    const status = document.getElementById('updateStatus');
    
    if (!input) return;

    const cleanInput = input.replace(/[\s\-\.]/g, '').toLowerCase();
    let type = input.includes("@") ? "Email" : (isNaN(cleanInput) ? "Khác" : "SĐT/STK");

    status.style.display = "block";
    status.textContent = "⌛ Đang gửi yêu cầu phê duyệt...";

    try {
        // GỬI DỮ LIỆU VÀO MỤC 'pending' (Chờ Admin duyệt)
        await fetch(`${BASE_URL}pending.json`, {
            method: 'POST',
            body: JSON.stringify({ 
                type: type, 
                value: cleanInput, 
                status: "waiting", // Đánh dấu trạng thái
                date: new Date().toLocaleString() 
            })
        });
        
        status.className = "status-box safe";
        status.textContent = "✅ Đã gửi! Thông tin sẽ hiển thị sau khi Admin kiểm tra.";
        document.getElementById('updateInput').value = "";
    } catch (e) {
        status.className = "status-box warning";
        status.textContent = "❌ Lỗi khi gửi dữ liệu.";
    }
}

// Gắn sự kiện cho các nút
document.getElementById('checkButton').onclick = checkScam;
document.getElementById('updateButton').onclick = updateScam;

// Hỗ trợ nhấn phím Enter
document.getElementById('phoneInput').onkeypress = (e) => { if(e.key === 'Enter') checkScam(); };
document.getElementById('updateInput').onkeypress = (e) => { if(e.key === 'Enter') updateScam(); };
