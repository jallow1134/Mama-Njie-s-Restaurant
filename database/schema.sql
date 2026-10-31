CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  dish VARCHAR(100),
  date VARCHAR(50),
  time VARCHAR(20),
  guests INT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL
);

INSERT IGNORE INTO menu (name, category, price) VALUES
  ('Mama Njie''s Special', 'Chef Specials', 120),
  ('Mama Njie''s Grilled Fish', 'Chef Specials', 95),
  ('Mama Njie''s Peanut Stew', 'Chef Specials', 85),
  ('Mama Njie''s Jollof Feast', 'Chef Specials', 80),
  ('Jollof Rice', 'Main Dishes', 80),
  ('Seafood Okra', 'Main Dishes', 95),
  ('Pepper Soup', 'Main Dishes', 75),
  ('Benachin', 'Main Dishes', 95),
  ('Caldo', 'Main Dishes', 88),
  ('Chewdiw', 'Main Dishes', 90),
  ('Domoda', 'Main Dishes', 85),
  ('Mbahal', 'Main Dishes', 90),
  ('Moimoi', 'Main Dishes', 65),
  ('Oyster Stew', 'Main Dishes', 85),
  ('Plasas', 'Main Dishes', 70),
  ('Supakanja', 'Main Dishes', 75),
  ('Yassa', 'Main Dishes', 80),
  ('Vegetable Platter', 'Sides & Drinks', 65),
  ('Attaya', 'Sides & Drinks', 12),
  ('Fish Balls', 'Sides & Drinks', 35),
  ('Tapalapa', 'Sides & Drinks', 15);