export const dbSetupString = `
  PRAGMA journal_mode = 'wal';
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS things (
    createdAt TEXT    NOT NULL,
    currentlyTracking INTEGER NOT NULL DEFAULT 1,
    id        TEXT    PRIMARY KEY NOT NULL,
    title     TEXT    NOT NULL,
    updatedAt TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key       TEXT    PRIMARY KEY NOT NULL,
    value     TEXT
  );

  CREATE TABLE IF NOT EXISTS entries (
    id        TEXT    PRIMARY KEY NOT NULL,
    thingId   TEXT    NOT NULL
                      REFERENCES things(id)
                      ON DELETE CASCADE,
    timestamp TEXT    NOT NULL
  );
`;
