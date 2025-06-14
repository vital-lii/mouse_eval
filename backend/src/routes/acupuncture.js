const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mouse_eval_db'
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 创建针刺记录
router.post('/', async (req, res) => {
  try {
    const { mouse_id, intervention_date, temperature, humidity, anesthesia_concentration } = req.body;
    
    const connection = await pool.getConnection();
    
    // 检查小鼠是否存在
    const [mouseExists] = await connection.execute(
      'SELECT id FROM mice WHERE id = ?',
      [mouse_id]
    );

    if (mouseExists.length === 0) {
      connection.release();
      return res.status(404).json({ error: '小鼠编号不存在' });
    }

    // 插入针刺记录
    const [result] = await connection.execute(
      `INSERT INTO acupuncture_records 
       (mouse_id, intervention_date, temperature, humidity, anesthesia_concentration) 
       VALUES (?, ?, ?, ?, ?)`,
      [mouse_id, intervention_date, temperature, humidity, anesthesia_concentration]
    );

    connection.release();
    res.status(201).json({
      id: result.insertId,
      mouse_id,
      intervention_date,
      temperature,
      humidity,
      anesthesia_concentration
    });
  } catch (error) {
    console.error('创建针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有针刺记录
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [records] = await connection.execute(
      `SELECT * FROM acupuncture_records ORDER BY intervention_date DESC`
    );
    connection.release();
    res.json(records);
  } catch (error) {
    console.error('获取针刺记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取特定小鼠的针刺记录
router.get('/mouse/:mouseId', async (req, res) => {
  try {
    const { mouseId } = req.params;
    const connection = await pool.getConnection();
    const [records] = await connection.execute(
      `SELECT * FROM acupuncture_records WHERE mouse_id = ? ORDER BY intervention_date DESC`,
      [mouseId]
    );
    connection.release();
    res.json(records);
  } catch (error) {
    console.error('获取小鼠针刺记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除针刺记录
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM acupuncture_records WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }
    res.json({ message: '记录删除成功' });
  } catch (error) {
    console.error('删除针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router; 