const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../db/pool');

// 创建小鼠（移除了对id的校验）
router.post('/', async (req, res) => {
  const { custom_id, group_name, weight } = req.body;

  // 只验证必填字段
  if (!group_name) {
    return res.status(400).json({ 
      error: "缺少必要字段",
      details: { group_name: "组别名称不能为空" } 
    });
  }

  try {
    // 插入数据库（不包含id字段）
    const [result] = await pool.execute(
      'INSERT INTO mice (custom_id, group_name, weight) VALUES (?, ?, ?)',
      [custom_id || null, group_name, weight]
    );
    
    res.json({ 
      id: result.insertId, // 返回数据库自增的ID
      custom_id,
      group_name,
      weight
    });
  } catch (err) {
    res.status(500).json({ error: "数据库插入失败", details: err.message });
  }
});

// 获取所有小鼠
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mice');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个小鼠信息
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM mice WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: '小鼠不存在' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新小鼠信息
router.put('/:id', async (req, res) => {
  try {
    const { custom_id, group_name, weight } = req.body;
    const [result] = await pool.execute(
      'UPDATE mice SET custom_id = ?, group_name = ?, weight = ? WHERE id = ?',
      [custom_id, group_name, weight, req.params.id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '小鼠不存在' });
      return;
    }
    res.json({ 
      id: req.params.id, 
      custom_id,
      group_name,
      weight
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除小鼠
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM mice WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '小鼠不存在' });
      return;
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 