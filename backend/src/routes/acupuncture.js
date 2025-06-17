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
      anesthesia_concentration,
      operator,
      weight,
      general_condition,
      special_condition,
      anesthesia_start,
      anesthesia_effect_time,
      maintenance_concentration,
      wake_up_time,
      acupuncture_start_time,
      needle_response,
      retention_status,
      end_time,
      recovery_quality,
      adverse_reactions,
      recovery_status,
      activity_score,
      notes
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
      `INSERT INTO acupuncture_intervention (
        mouse_id, intervention_date, operator, weight, 
        general_condition, special_condition,
        anesthesia_start, anesthesia_effect_time, maintenance_concentration,
        wake_up_time, acupuncture_start_time, needle_response,
        retention_status, end_time, recovery_quality,
        adverse_reactions, recovery_status, activity_score, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mouse_id,
        intervention_date,
        operator || null,
        Number(weight || 0),
        general_condition || null,
        special_condition || null,
        anesthesia_start || null,
        anesthesia_effect_time || null,
        Number(maintenance_concentration || 0),
        wake_up_time || null,
        acupuncture_start_time || null,
        needle_response || null,
        retention_status || null,
        end_time || null,
        recovery_quality || null,
        adverse_reactions || null,
        recovery_status || null,
        Number(activity_score || 0),
        notes || null
      ]
    );

    // 获取新创建的记录
    const [newRecord] = await pool.execute(
      'SELECT * FROM acupuncture_intervention WHERE id = ?',
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
       FROM acupuncture_intervention a
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
       FROM acupuncture_intervention a
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
       FROM acupuncture_intervention a
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
      operator,
      weight,
      general_condition,
      special_condition,
      anesthesia_start,
      anesthesia_effect_time,
      maintenance_concentration,
      wake_up_time,
      acupuncture_start_time,
      needle_response,
      retention_status,
      end_time,
      recovery_quality,
      adverse_reactions,
      recovery_status,
      activity_score,
      notes
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE acupuncture_intervention SET
        operator = ?,
        weight = ?,
        general_condition = ?,
        special_condition = ?,
        anesthesia_start = ?,
        anesthesia_effect_time = ?,
        maintenance_concentration = ?,
        wake_up_time = ?,
        acupuncture_start_time = ?,
        needle_response = ?,
        retention_status = ?,
        end_time = ?,
        recovery_quality = ?,
        adverse_reactions = ?,
        recovery_status = ?,
        activity_score = ?,
        notes = ?
      WHERE id = ?`,
      [
        operator || null,
        Number(weight || 0),
        general_condition || null,
        special_condition || null,
        anesthesia_start || null,
        anesthesia_effect_time || null,
        Number(maintenance_concentration || 0),
        wake_up_time || null,
        acupuncture_start_time || null,
        needle_response || null,
        retention_status || null,
        end_time || null,
        recovery_quality || null,
        adverse_reactions || null,
        recovery_status || null,
        Number(activity_score || 0),
        notes || null,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '针刺记录不存在' });
    }

    // 获取更新后的记录
    const [updatedRecord] = await pool.execute(
      'SELECT * FROM acupuncture_intervention WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedRecord[0]);
  } catch (error) {
    console.error('更新针刺记录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除针刺记录
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM acupuncture_intervention WHERE id = ?',
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