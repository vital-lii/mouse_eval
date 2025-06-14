const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 创建新评分记录
router.post('/', async (req, res) => {
  try {
    const {
      mouse_id,
      evaluation_date,
      activity_level,
      grooming_behavior
    } = req.body;

    // 检查小鼠是否存在
    const [mouseExists] = await pool.execute(
      'SELECT id FROM mice WHERE id = ?',
      [mouse_id]
    );

    if (mouseExists.length === 0) {
      return res.status(404).json({ error: '小鼠编号不存在' });
    }

    // 插入评分记录
    const [result] = await pool.execute(
      `INSERT INTO evaluations (
        mouse_id, evaluation_date, activity_score, grooming_score
      ) VALUES (?, ?, ?, ?)`,
      [
        mouse_id,
        evaluation_date,
        Number(activity_level || 0),
        Number(grooming_behavior || 0)
      ]
    );

    res.status(201).json({
      id: result.insertId,
      mouse_id,
      evaluation_date,
      activity_score: activity_level,
      grooming_score: grooming_behavior,
      message: '评分记录创建成功'
    });
  } catch (error) {
    console.error('创建评分记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取小鼠的所有评分记录
router.get('/mouse/:mouseId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM evaluations WHERE mouse_id = ? ORDER BY evaluation_date DESC',
      [req.params.mouseId]
    );
    res.json(rows);
  } catch (error) {
    console.error('获取评分记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个评分记录详情
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM evaluations WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '评分记录不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取评分记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新评分记录
router.put('/:id', async (req, res) => {
  try {
    const {
      activity_level,
      grooming_behavior
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE evaluations SET
        activity_score = ?,
        grooming_score = ?
      WHERE id = ?`,
      [
        Number(activity_level || 0),
        Number(grooming_behavior || 0),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '评分记录不存在' });
    }

    res.json({
      id: req.params.id,
      message: '评分记录更新成功'
    });
  } catch (error) {
    console.error('更新评分记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有评分记录
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, m.custom_id as mouse_custom_id 
      FROM evaluations e 
      LEFT JOIN mice m ON e.mouse_id = m.id 
      ORDER BY e.evaluation_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('获取评分记录列表失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router; 