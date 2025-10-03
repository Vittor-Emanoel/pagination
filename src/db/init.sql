DROP DATABASE IF EXISTS pagination;
CREATE DATABASE pagination;

\c pagination

CREATE TABLE posts(
  id SERIAL PRIMARY KEY ,
  title VARCHAR(255),
  content TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_summary(
  entity VARCHAR(100) PRIMARY KEY,
  total_count INTEGER DEFAULT 0
);

-- functions

CREATE FUNCTION update_posts_total_count() RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE system_summary
      SET total_count = total_count + 1
      WHERE entity = 'posts';
    END IF;

    IF TG_OP = 'DELETE' THEN
      UPDATE system_summary
      SET total_count = total_count - 1
      WHERE entity = 'posts';
    END IF;

    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

-- triggers

CREATE TRIGGER update_posts_total_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_posts_total_count();

--- seeds

INSERT INTO system_summary(entity) VALUES ('posts');

DO $$
  DECLARE
    i INTEGER;
  BEGIN
    FOR i IN 1..100 LOOP
      INSERT INTO posts(title, content)
      VALUES ('Post ' || i, 'Conteudo do post ' || i);
      -- UPDATE system_summary
      -- SET total_count = total_count + 1
      -- WHERE entity = 'posts';
    END LOOP;
END $$




