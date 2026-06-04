require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware để đọc JSON từ body và cấu hình CORS chặt chẽ hơn
app.use(cors({
    origin: process.env.CLIENT_URL || '*' // Thay '*' bằng domain thực tế trên production
}));
app.use(express.json());

// Secret key để ký JWT (Trong thực tế nên đưa vào file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// Trùng khớp với đường dẫn $baseUrl/v1/login trên Flutter
app.post('/v1/login', (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào (Input Validation)
    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ email và mật khẩu!' });
    }

    // Giả lập check DB: Chỉ cho phép admin@fitpulse.com / 123456
    // TODO: Trong thực tế cần query DB và dùng bcrypt để so sánh mật khẩu đã hash
    if (email === 'admin@fitpulse.com' && password === '123456') {
        // Tạo ra một Token JWT thực sự có thời hạn 7 ngày
        const token = jwt.sign(
            { userId: 1, email: email, role: 'admin' }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Trả về HTTP Status 200 và token
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token
        });
    } else {
        // Trả về HTTP Status 401 (Unauthorized) nếu sai pass
        return res.status(401).json({
            message: 'Sai email hoặc mật khẩu!'
        });
    }
});

// Cấu hình Port cho Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FitPulse API đang chạy tại port ${PORT}`);
});
