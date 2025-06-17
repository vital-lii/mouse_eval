const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const miceRoutes = require('./routes/mice');
const evaluationsRoutes = require('./routes/evaluations');
const acupunctureRoutes = require('./routes/acupuncture');
const trainingRoutes = require('./routes/training');

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 添加安全头中间件
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mouse_eval_db'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 路由
app.use('/api/mice', miceRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/acupuncture', acupunctureRoutes);
app.use('/api/training', trainingRoutes);
// 测试路由
app.get('/', async (req, res) => {
  res.json({ message: 'Mouse Evaluation Backend API' });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 数据库连接测试
app.get('/db-test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(port, '0.0.0.0', () => {  // 显式绑定到 0.0.0.0
  console.log(`Server running on port ${port}`);
});
