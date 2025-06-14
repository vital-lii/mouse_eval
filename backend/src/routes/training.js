const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 创建训练记录
router.post('/', async (req, res) => {
  try {
    console.log('收到训练记录数据:', req.body);
    const {
      mouse_id,
      training_date,
      weight,
      food_intake,
      water_intake
    } = req.body;

    // 验证必填字段
    if (!mouse_id || !training_date) {
      return res.status(400).json({ 
        error: "缺少必要字段",
        details: {
          mouse_id: mouse_id ? null : "小鼠ID不能为空",
          training_date: training_date ? null : "训练日期不能为空"
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

    // 插入训练记录
    const [result] = await pool.execute(
      `INSERT INTO bell_training (
        mouse_id, training_date, weight, food_intake, water_intake
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        mouse_id,
        training_date,
        Number(weight || 0),
        Number(food_intake || 0),
        Number(water_intake || 0)
      ]
    );

    // 获取新创建的记录
    const [newRecord] = await pool.execute(
      'SELECT * FROM bell_training WHERE id = ?',
      [result.insertId]
    );

    console.log('创建的训练记录:', newRecord[0]);
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('创建训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有训练记录
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.*, m.custom_id as mouse_custom_id 
       FROM bell_training t
       LEFT JOIN mice m ON t.mouse_id = m.id 
       ORDER BY t.training_date DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('获取训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个训练记录
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.*, m.custom_id as mouse_custom_id 
       FROM bell_training t
       LEFT JOIN mice m ON t.mouse_id = m.id 
       WHERE t.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '训练记录不存在' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('获取训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取指定小鼠的训练记录
router.get('/mouse/:mouseId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.*, m.custom_id as mouse_custom_id 
       FROM bell_training t
       LEFT JOIN mice m ON t.mouse_id = m.id 
       WHERE t.mouse_id = ? 
       ORDER BY t.training_date DESC`,
      [req.params.mouseId]
    );
    res.json(rows);
  } catch (error) {
    console.error('获取小鼠训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新训练记录
router.put('/:id', async (req, res) => {
  try {
    console.log('更新训练记录数据:', req.body);
    const {
      weight,
      food_intake,
      water_intake
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE bell_training SET
        weight = ?,
        food_intake = ?,
        water_intake = ?
      WHERE id = ?`,
      [
        Number(weight || 0),
        Number(food_intake || 0),
        Number(water_intake || 0),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '训练记录不存在' });
    }

    // 获取更新后的记录
    const [updated] = await pool.execute(
      `SELECT t.*, m.custom_id as mouse_custom_id 
       FROM bell_training t
       LEFT JOIN mice m ON t.mouse_id = m.id 
       WHERE t.id = ?`,
      [req.params.id]
    );

    console.log('更新后的训练记录:', updated[0]);
    res.json(updated[0]);
  } catch (error) {
    console.error('更新训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除训练记录
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM bell_training WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '训练记录不存在' });
    }

    res.json({ message: '训练记录删除成功' });
  } catch (error) {
    console.error('删除训练记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
