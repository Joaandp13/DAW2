USE backend_joan_diaz;

ALTER TABLE usuaris
  MODIFY password VARCHAR(255) NULL;

ALTER TABLE usuaris
  ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50) NULL AFTER admin,
  ADD COLUMN IF NOT EXISTS oauth_uid VARCHAR(191) NULL AFTER oauth_provider;

-- Evita duplicar la misma cuenta social
ALTER TABLE usuaris
  ADD UNIQUE KEY IF NOT EXISTS usuaris_oauth_uniq (oauth_provider, oauth_uid);