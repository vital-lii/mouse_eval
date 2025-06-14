-- 创建小鼠基本信息表
CREATE TABLE IF NOT EXISTS mice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    custom_id VARCHAR(255) NOT NULL,
    group_name VARCHAR(255),
    weight DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建响片训练记录表
CREATE TABLE IF NOT EXISTS bell_training (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mouse_id INT,
    training_date DATE,
    weight DECIMAL(5,2),
    food_intake DECIMAL(5,2),
    water_intake DECIMAL(5,2),
    morning_response_time INT,
    morning_entry_time INT,
    morning_stress_score INT,
    afternoon_response_time INT,
    afternoon_entry_time INT,
    afternoon_stress_score INT,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mouse_id) REFERENCES mice(id)
);

-- 创建针刺干预记录表
CREATE TABLE IF NOT EXISTS acupuncture_intervention (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mouse_id INT,
    intervention_date DATE,
    operator VARCHAR(50),
    temperature DECIMAL(4,1),
    humidity INT,
    weight DECIMAL(5,2),
    general_condition ENUM('良好', '一般', '差'),
    special_condition TEXT,
    anesthesia_start TIME,
    anesthesia_effect_time TIME,
    maintenance_concentration DECIMAL(3,1),
    wake_up_time TIME,
    acupuncture_start_time TIME,
    needle_response TEXT,
    retention_status TEXT,
    end_time TIME,
    recovery_quality ENUM('良好', '一般', '差'),
    adverse_reactions TEXT,
    recovery_status TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mouse_id) REFERENCES mice(id)
);

-- 创建评分记录表
CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mouse_id INT,
    evaluation_date DATE,
    evaluation_time TIME,
    operator VARCHAR(50),
    evaluator VARCHAR(50),
    -- 基础行为评分
    activity_score INT,
    grooming_score INT,
    fur_score INT,
    defecation_score INT,
    -- 操作相关评分
    escape_score INT,
    vocalization_score INT,
    attack_score INT,
    freezing_score INT,
    -- 训练相关评分
    response_time_score INT,
    feeding_willingness_score INT,
    exploration_score INT,
    -- 总分和备注
    total_score INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mouse_id) REFERENCES mice(id)
);

-- 创建气道激发评分表
CREATE TABLE IF NOT EXISTS airway_response (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mouse_id INT,
    evaluation_date DATE,
    score INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mouse_id) REFERENCES mice(id)
); 