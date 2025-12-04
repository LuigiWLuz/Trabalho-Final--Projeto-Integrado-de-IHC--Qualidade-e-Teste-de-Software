const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors()); // Permite que o React acesse a API
app.use(express.json());

// 1. Rota para pegar todos os shows (Para a Home.jsx)
app.get('/api/shows', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM shows');
    
    // Formatando para o formato que seu front espera (bandSlug, etc)
    const formattedShows = rows.map(show => ({
       ...show,
       bandSlug: show.slug,
       band: show.band_name,
       date: show.show_date,
       rating: show.age_rating,
       image: show.image_url
    }));
    
    res.json(formattedShows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Rota para pegar detalhes de um show específico (Para ShowDetails.jsx)
app.get('/api/shows/:slug', async (req, res) => {
  try {
    // Busca o show
    const [shows] = await db.query('SELECT * FROM shows WHERE slug = ?', [req.params.slug]);
    if (shows.length === 0) return res.status(404).json({ msg: 'Show não encontrado' });
    
    const show = shows[0];

    // Busca os ingressos desse show
    const [tickets] = await db.query('SELECT * FROM ticket_categories WHERE show_id = ?', [show.id]);

    // Monta o objeto completo
    res.json({
      bandSlug: show.slug,
      band: show.band_name,
      date: show.show_date,
      city: show.city,
      venue: show.venue,
      price: tickets[0]?.price, // Preço base
      rating: show.age_rating,
      image: show.image_url,
      description: show.description,
      tickets: tickets // Array de ingressos do banco
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Rota para salvar a compra (Para Checkout.jsx)
app.post('/api/orders', async (req, res) => {
  const { customer, items, total, showBand } = req.body;
  const connection = await db.getConnection(); // Usar transação para segurança

  try {
    await connection.beginTransaction();

    const orderCode = 'MT-' + Math.floor(Math.random() * 100000);

    // Salva o Pedido na tabela 'orders'
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_code, customer_name, customer_email, customer_cpf, payment_method, total_amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderCode, customer.name, customer.email, customer.cpf, customer.paymentMethod, total]
    );

    const orderId = orderResult.insertId;

    // Salva os Itens na tabela 'order_items'
    for (const item of items) {
      // Nota: No frontend precisamos enviar o ID do ticket_category, não só o nome
      await connection.query(
        `INSERT INTO order_items (order_id, ticket_category_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await connection.commit();
    
    res.json({ 
        success: true, 
        orderId: orderCode, 
        band: showBand,
        email: customer.email,
        totalPaid: total 
    });

  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erro ao processar compra: ' + err.message });
  } finally {
    connection.release();
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});