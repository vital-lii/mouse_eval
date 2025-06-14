const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// 创建新评分记录
router.post('/', async (req, res) => {
  try {
    const {
      mouse_id,
      evaluation_date,
      evaluation_time,
      operator,
      evaluator,
      activity_score,
      grooming_score,
      fur_score,
      defecation_score,
      escape_score,
      vocalization_score,
      attack_score,
      freezing_score,
      response_time_score,
      feeding_willingness_score,
      exploration_score,
      notes
    } = req.body;

    // 计算总分
    const total_score = [
      activity_score,
      grooming_score,
      fur_score,
      defecation_score,
      escape_score,
      vocalization_score,
      attack_score,
      freezing_score,
      response_time_score,
      feeding_willingness_score,
      exploration_score
    ].reduce((a, b) => a + b, 0);

    const [result] = await pool.execute(
      `INSERT INTO evaluations (
        mouse_id, evaluation_date, evaluation_time, operator, evaluator,
        activity_score, grooming_score, fur_score, defecation_score,
        escape_score, vocalization_score, attack_score, freezing_score,
        response_time_score, feeding_willingness_score, exploration_score,
        total_score, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mouse_id, evaluation_date, evaluation_time, operator, evaluator,
        activity_score, grooming_score, fur_score, defecation_score,
        escape_score, vocalization_score, attack_score, freezing_score,
        response_time_score, feeding_willingness_score, exploration_score,
        total_score, notes
      ]
    );

    res.json({
      id: result.insertId,
      total_score,
      message: '评分记录创建成功'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取小鼠的所有评分记录
router.get('/mouse/:mouseId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM evaluations WHERE mouse_id = ? ORDER BY evaluation_date DESC, evaluation_time DESC',
      [req.params.mouseId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      res.status(404).json({ message: '评分记录不存在' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新评分记录
router.put('/:id', async (req, res) => {
  try {
    const {
      activity_score,
      grooming_score,
      fur_score,
      defecation_score,
      escape_score,
      vocalization_score,
      attack_score,
      freezing_score,
      response_time_score,
      feeding_willingness_score,
      exploration_score,
      notes
    } = req.body;

    // 计算新的总分
    const total_score = [
      activity_score,
      grooming_score,
      fur_score,
      defecation_score,
      escape_score,
      vocalization_score,
      attack_score,
      freezing_score,
      response_time_score,
      feeding_willingness_score,
      exploration_score
    ].reduce((a, b) => a + b, 0);

    const [result] = await pool.execute(
      `UPDATE evaluations SET
        activity_score = ?,
        grooming_score = ?,
        fur_score = ?,
        defecation_score = ?,
        escape_score = ?,
        vocalization_score = ?,
        attack_score = ?,
        freezing_score = ?,
        response_time_score = ?,
        feeding_willingness_score = ?,
        exploration_score = ?,
        total_score = ?,
        notes = ?
      WHERE id = ?`,
      [
        activity_score,
        grooming_score,
        fur_score,
        defecation_score,
        escape_score,
        vocalization_score,
        attack_score,
        freezing_score,
        response_time_score,
        feeding_willingness_score,
        exploration_score,
        total_score,
        notes,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: '评分记录不存在' });
      return;
    }

    res.json({
      id: req.params.id,
      total_score,
      message: '评分记录更新成功'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 