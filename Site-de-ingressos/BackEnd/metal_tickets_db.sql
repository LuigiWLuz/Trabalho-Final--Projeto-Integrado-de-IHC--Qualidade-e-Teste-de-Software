-- 1. Criação do Banco de Dados
DROP DATABASE IF EXISTS metal_tickets_db; -- Garante que começa do zero
CREATE DATABASE metal_tickets_db;
USE metal_tickets_db;

-- --------------------------------------------------------

-- 2. Tabela de Usuários (Login)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

-- 3. Tabela de Shows
CREATE TABLE shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    band_name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    show_date DATETIME NOT NULL,
    age_rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

-- 4. Tabela de Categorias de Ingressos (Setores)
CREATE TABLE ticket_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 1000,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

-- --------------------------------------------------------

-- 5. Tabela de Pedidos (Compras)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_cpf VARCHAR(14) NOT NULL,
    payment_method ENUM('credit_card', 'pix', 'bank_slip') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- --------------------------------------------------------

-- 6. Tabela de Itens do Pedido
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    ticket_category_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_category_id) REFERENCES ticket_categories(id)
);

-- ========================================================
-- DADOS INICIAIS (SEED)
-- ========================================================

-- Inserindo os Shows (Já com imagens locais e cidade corrigida)
INSERT INTO shows (slug, band_name, description, image_url, city, venue, show_date, age_rating) VALUES
('metallica', 'Metallica', 'Os gigantes do trash metal estão de volta para um show épico!', '/imgs/metallica.jpg', 'São Paulo', 'Allianz Parque', '2025-10-15 21:00:00', 16),
('slipknot', 'Slipknot', 'A banda de metal alternativo mais assustadora do mundo!', '/imgs/slipknot.jpg', 'Curitiba', 'Pedreira Paulo Leminski', '2025-11-03 20:00:00', 18),
('iron-maiden', 'Iron Maiden', 'Os lendários mestres do heavy metal em turnê mundial!', '/imgs/iron-maiden.jpg', 'Rio de Janeiro', 'Jockey Club', '2026-01-21 21:00:00', 16),
('pantera', 'Pantera', 'O retorno do groove metal com Phil Anselmo!', '/imgs/pantera.jpg', 'Porto Alegre', 'Arena do Grêmio', '2026-02-18 20:00:00', 18),
('pierce-the-veil', 'Pierce The Veil', 'A banda Pierce The Veil retorna ao Brasil para uma apresentação única, celebrando 10 anos de seu álbum de maior sucesso.', '/imgs/PTV.jpg', 'São Paulo', 'Audio Club', '2025-12-20 22:00:00', 16),
('sepultura', 'Sepultura', 'A turnê histórica de despedida da maior banda de metal do Brasil. Uma noite única e emocionante celebrando 40 anos de história.', '/imgs/sepultura.jpg', 'São Paulo', 'Espaço Unimed', '2025-09-06 21:00:00', 18);

-- Inserindo os Ingressos
-- ATENÇÃO: Os IDs de show_id seguem a ordem de inserção acima (1 a 6).
-- O show 6 (Sepultura) NÃO tem ingressos inseridos propositalmente para testar o fluxo de "Esgotado".

-- 1. Metallica
INSERT INTO ticket_categories (show_id, name, price) VALUES 
(1, 'Pista Premium', 450.00),
(1, 'Cadeira Inferior', 350.00),
(1, 'Camarote', 700.00);

-- 2. Slipknot
INSERT INTO ticket_categories (show_id, name, price) VALUES 
(2, 'Pista', 380.00),
(2, 'Camarote', 550.00);

-- 3. Iron Maiden
INSERT INTO ticket_categories (show_id, name, price) VALUES 
(3, 'Pista Premium', 500.00),
(3, 'Arquibancada', 300.00);

-- 4. Pantera
INSERT INTO ticket_categories (show_id, name, price) VALUES 
(4, 'Pista', 350.00),
(4, 'Cadeira', 250.00);

-- 5. Pierce The Veil
INSERT INTO ticket_categories (show_id, name, price) VALUES 
(5, 'Pista Premium', 450.00),
(5, 'Pista Comum', 250.00);

-- Inserindo um Usuário de Teste
INSERT INTO users (name, email, password_hash, cpf, phone) VALUES
('Admin User', 'admin@metaltickets.com', 'hash_da_senha_aqui', '000.000.000-00', '(11) 99999-9999');