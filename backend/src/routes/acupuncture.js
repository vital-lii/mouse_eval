const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 创建针刺记录
router.post('/', async (req, res) => {
  try {
    const { mouse_id, intervention_date, temperature, humidity, anesthesia_concentration } = req.body;
    
    // 检查小鼠是否存在
    const [mouseExists] = await pool.execute(
      'SELECT id FROM mice WHERE id = ?',
      [mouse_id]
    );

    if (mouseExists.length === 0) {
      return res.status(404).json({ error: '小鼠编号不存在' });
    }

    // 插入针刺记录
    const [result] = await pool.execute(
      `INSERT INTO acupuncture_intervention 
       (mouse_id, intervention_date, temperature, humidity, maintenance_concentration) 
       VALUES (?, ?, ?, ?, ?)`,
      [mouse_id, intervention_date, temperature, humidity, anesthesia_concentration]
    );

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
    const [records] = await pool.execute(
      `SELECT * FROM acupuncture_intervention ORDER BY intervention_date DESC`
    );
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
    const [records] = await pool.execute(
      `SELECT * FROM acupuncture_intervention WHERE mouse_id = ? ORDER BY intervention_date DESC`,
      [mouseId]
    );
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
    const [result] = await pool.execute(
      'DELETE FROM acupuncture_intervention WHERE id = ?',
      [id]
    );

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