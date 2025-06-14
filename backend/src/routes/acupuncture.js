const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 创建针刺记录
router.post('/', async (req, res) => {
  try {
    console.log('收到针刺记录数据:', req.body);
    const {
      mouse_id,
      intervention_date,
      temperature,
      humidity,
      anesthesia_concentration
    } = req.body;

    // 验证必填字段
    if (!mouse_id || !intervention_date) {
      return res.status(400).json({ 
        error: "缺少必要字段",
        details: {
          mouse_id: mouse_id ? null : "小鼠ID不能为空",
          intervention_date: intervention_date ? null : "干预日期不能为空"
        }
      });
    }

    // 检查小鼠是否存在
    const [mouseExists] = await pool.execute(
      'SELECT id FROM mice WHERE id = ?',
      [mouse_id]
    );

    if (mouseExists.length === 0) {
      return res.status(404).json({ error: '小鼠不存在' });
    }

    // 插入针刺记录
    const [result] = await pool.execute(
      `INSERT INTO acupuncture (
        mouse_id, intervention_date, temperature, humidity, anesthesia_concentration
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        mouse_id,
        intervention_date,
        Number(temperature || 0),
        Number(humidity || 0),
        Number(anesthesia_concentration || 0)
      ]
    );

    // 获取新创建的记录
    const [newRecord] = await pool.execute(
      'SELECT * FROM acupuncture WHERE id = ?',
      [result.insertId]
    );

    console.log('创建的针刺记录:', newRecord[0]);
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('创建针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有针刺记录
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, m.custom_id as mouse_custom_id 
       FROM acupuncture a
       LEFT JOIN mice m ON a.mouse_id = m.id 
       ORDER BY a.intervention_date DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('获取针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个针刺记录
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, m.custom_id as mouse_custom_id 
       FROM acupuncture a
       LEFT JOIN mice m ON a.mouse_id = m.id 
       WHERE a.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '针刺记录不存在' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('获取针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取指定小鼠的针刺记录
router.get('/mouse/:mouseId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, m.custom_id as mouse_custom_id 
       FROM acupuncture a
       LEFT JOIN mice m ON a.mouse_id = m.id 
       WHERE a.mouse_id = ? 
       ORDER BY a.intervention_date DESC`,
      [req.params.mouseId]
    );
    res.json(rows);
  } catch (error) {
    console.error('获取小鼠针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新针刺记录
router.put('/:id', async (req, res) => {
  try {
    console.log('更新针刺记录数据:', req.body);
    const {
      temperature,
      humidity,
      anesthesia_concentration
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE acupuncture SET
        temperature = ?,
        humidity = ?,
        anesthesia_concentration = ?
      WHERE id = ?`,
      [
        Number(temperature || 0),
        Number(humidity || 0),
        Number(anesthesia_concentration || 0),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '针刺记录不存在' });
    }

    // 获取更新后的记录
    const [updated] = await pool.execute(
      `SELECT a.*, m.custom_id as mouse_custom_id 
       FROM acupuncture a
       LEFT JOIN mice m ON a.mouse_id = m.id 
       WHERE a.id = ?`,
      [req.params.id]
    );

    console.log('更新后的针刺记录:', updated[0]);
    res.json(updated[0]);
  } catch (error) {
    console.error('更新针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除针刺记录
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM acupuncture WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '针刺记录不存在' });
    }

    res.json({ message: '针刺记录删除成功' });
  } catch (error) {
    console.error('删除针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router; 