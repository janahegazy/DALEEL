USE daleel;
SHOW TABLES;
DESCRIBE users;
USE daleel;

-- امسحي البيانات القديمة الغلط لو موجودة
DELETE FROM users;

-- حطي يوزرز جدد بباسورد حقيقي (الباسورد هو: Test1234)
INSERT INTO users (full_name, email, password_hash, role_id, is_verified, is_active) VALUES
('Ahmed Hassan',       'ahmed@test.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, 1),
('Sara El-Sayed',      'sara@test.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, 1),
('Cafe Nile',          'cafe@test.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1, 1),
('Cairo Governorate',  'cairo@test.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1, 1);