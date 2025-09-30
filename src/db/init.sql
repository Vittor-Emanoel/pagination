DROP DATABASE IF EXISTS pagination;
CREATE DATABASE pagination;

\c pagination

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE posts(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  content TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

--- seeds

DO $$
  DECLARE
    i INTEGER;
  BEGIN
    FOR i IN 1..1000000 LOOP
      INSERT INTO posts(title, content)
      VALUES ('Post ' || i, 'Conteudo do post ' || i);
    END LOOP;
END $$




