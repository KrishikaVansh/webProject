CREATE DATABASE IF NOT EXISTS mentalHealth;
USE mentalHealth;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'therapist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE therapist_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    specialization VARCHAR(255),
    bio TEXT,
    availability JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    therapist_id INT,
    appointment_time DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE mood_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mood_rating INT NOT NULL,
    notes TEXT,
    entry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id, entry_date)
);

CREATE TABLE journal_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    category VARCHAR(100)
);


USE mentalHealth;

-- ========== USERS (20 rows: 10 clients, 10 therapists) ==========
INSERT INTO users (name, email, password_hash, role) VALUES
('Alice Client','alice.client1@example.com','password123','client'),
('Ben Client','ben.client2@example.com','password123','client'),
('Cara Client','cara.client3@example.com','password123','client'),
('Dan Client','dan.client4@example.com','password123','client'),
('Eve Client','eve.client5@example.com','password123','client'),
('Finn Client','finn.client6@example.com','password123','client'),
('Gia Client','gia.client7@example.com','password123','client'),
('Hector Client','hector.client8@example.com','password123','client'),
('Ivy Client','ivy.client9@example.com','password123','client'),
('Jay Client','jay.client10@example.com','password123','client'),
('Dr. Aaron','aaron.therapist1@example.com','password123','therapist'),
('Dr. Bella','bella.therapist2@example.com','password123','therapist'),
('Dr. Cyrus','cyrus.therapist3@example.com','password123','therapist'),
('Dr. Diana','diana.therapist4@example.com','password123','therapist'),
('Dr. Ethan','ethan.therapist5@example.com','password123','therapist'),
('Dr. Fiona','fiona.therapist6@example.com','password123','therapist'),
('Dr. Greg','greg.therapist7@example.com','password123','therapist'),
('Dr. Hannah','hannah.therapist8@example.com','password123','therapist'),
('Dr. Ian','ian.therapist9@example.com','password123','therapist'),
('Dr. Jane','jane.therapist10@example.com','password123','therapist');

-- If you prefer fewer users, remove rows accordingly.

-- ========== THERAPIST_PROFILES (10 rows: one per therapist user 11..20) ==========
INSERT INTO therapist_profiles (user_id, specialization, bio, availability) VALUES
(11, 'Cognitive Behavioral Therapy', 'Specialist in CBT for anxiety and stress.', '{"monday":["09:00","12:00"],"wednesday":["14:00","17:00"]}'),
(12, 'Child & Adolescent Therapy', 'Works with teens and families.', '{"tuesday":["10:00","15:00"],"thursday":["09:00","12:00"]}'),
(13, 'Relationship Counseling', 'Focus on couples and relationship dynamics.', '{"monday":["13:00","17:00"],"friday":["10:00","14:00"]}'),
(14, 'Trauma-Informed Therapy', 'Trauma recovery and resilience building.', '{"wednesday":["09:00","12:00"],"thursday":["14:00","18:00"]}'),
(15, 'Mindfulness & Stress Reduction', 'Integrates mindfulness with therapy.', '{"monday":["08:00","11:00"],"saturday":["09:00","12:00"]}'),
(16, 'Grief Counseling', 'Support for bereavement and loss.', '{"tuesday":["09:00","12:00"],"friday":["12:00","16:00"]}'),
(17, 'Depression Specialist', 'Treatment plans for depressive disorders.', '{"wednesday":["13:00","17:00"],"thursday":["09:00","12:00"]}'),
(18, 'Addiction Counseling', 'Substance use disorder treatment and relapse prevention.', '{"monday":["15:00","18:00"],"sunday":["10:00","13:00"]}'),
(19, 'Couples Therapy', 'Nonjudgmental space for couples to grow.', '{"tuesday":["13:00","17:00"],"thursday":["13:00","16:00"]}'),
(20, 'Childhood Trauma', 'Therapy for complex childhood experiences.', '{"wednesday":["09:00","12:00"],"saturday":["14:00","17:00"]}');

-- ========== APPOINTMENTS (10 rows)
-- client_id: 1..10 (clients), therapist_id: 11..20 (therapists)
INSERT INTO appointments (client_id, therapist_id, appointment_time, status) VALUES
(1, 11, '2025-11-01 10:00:00', 'scheduled'),
(2, 12, '2025-11-02 11:30:00', 'scheduled'),
(3, 13, '2025-11-03 09:00:00', 'scheduled'),
(4, 14, '2025-11-04 15:00:00', 'scheduled'),
(5, 15, '2025-11-05 14:00:00', 'scheduled'),
(6, 16, '2025-11-06 13:00:00', 'scheduled'),
(7, 17, '2025-11-07 10:30:00', 'scheduled'),
(8, 18, '2025-11-08 16:00:00', 'scheduled'),
(9, 19, '2025-11-09 09:30:00', 'scheduled'),
(10,20, '2025-11-10 11:00:00', 'scheduled');

-- ========== MOOD_ENTRIES (10 rows) for clients 1..10
INSERT INTO mood_entries (user_id, mood_rating, notes, entry_date) VALUES
(1, 4, 'Calm and focused today.', '2025-10-20'),
(2, 3, 'A bit tired but okay.', '2025-10-20'),
(3, 2, 'Struggled with motivation.', '2025-10-20'),
(4, 5, 'Great day, productive!', '2025-10-20'),
(5, 4, 'Managed stress well.', '2025-10-20'),
(6, 3, 'Ups and downs.', '2025-10-20'),
(7, 2, 'Feeling low this morning.', '2025-10-20'),
(8, 4, 'Good social interactions today.', '2025-10-20'),
(9, 1, 'Very anxious, needed support.', '2025-10-20'),
(10,3, 'Average day.', '2025-10-20');

-- ========== JOURNAL_ENTRIES (10 rows) for clients 1..10
INSERT INTO journal_entries (user_id, title, content) VALUES
(1, 'Morning Reflection','Felt grounded after morning routine. Focused on breathing.'),
(2, 'Work Challenges','Today I handled a tricky task and learned something new.'),
(3, 'Low Energy Day','Had a hard time getting up. Tried small tasks.'),
(4, 'Wins','Completed a big task, celebrated with a walk.'),
(5, 'Gratitude','Grateful for supportive friends and family.'),
(6, 'Mood Notes','Recognized patterns that trigger stress.'),
(7, 'Coping Strategies','Tried a breathing exercise, helped somewhat.'),
(8, 'Social','Had a meaningful chat with a colleague.'),
(9, 'Anxiety Log','Worry peaked after news, used grounding techniques.'),
(10,'Small Steps','Made progress on a long-term goal today.');

-- ========== RESOURCES (10 rows)
INSERT INTO resources (title, description, video_url, category) VALUES
('5-min Mindful Breathing','Short guided breathing exercise','https://www.youtube.com/watch?v=example1','meditation'),
('Body Scan Relaxation','Audio body-scan for relaxation','https://www.youtube.com/watch?v=example2','meditation'),
('Progressive Muscle Relax','Guided progressive muscle relaxation','https://www.youtube.com/watch?v=example3','exercise'),
('10-min Yoga Stretch','Gentle yoga for mornings','https://www.youtube.com/watch?v=example4','exercise'),
('Guided Imagery','Visualization for stress relief','https://www.youtube.com/watch?v=example5','meditation'),
('Grounding Techniques','Practical grounding methods','https://www.youtube.com/watch?v=example6','coping'),
('Sleep Hygiene Tips','Advice for better sleep','https://www.youtube.com/watch?v=example7','wellness'),
('Walking Meditation','Mindful walking practice','https://www.youtube.com/watch?v=example8','exercise'),
('Calm Music 30min','Ambient calm music for focus','https://www.youtube.com/watch?v=example9','music'),
('Self-Compassion Exercise','Short practice to boost self-kindness','https://www.youtube.com/watch?v=example10','meditation');

