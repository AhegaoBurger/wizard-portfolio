import { Database } from 'bun:sqlite'
import { join } from 'path'

const PROJECT_ROOT = process.cwd()
const DB_PATH = join(PROJECT_ROOT, 'data', 'wizard.db')

let db: Database | null = null

export function getDB(): Database {
  if (!db) {
    // Ensure data directory exists
    const { mkdirSync } = require('fs')
    mkdirSync(join(PROJECT_ROOT, 'data'), { recursive: true })

    db = new Database(DB_PATH)
    db.exec('PRAGMA journal_mode = WAL')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      route TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      definition TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS seed_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)
}

export function closeDB() {
  if (db) {
    db.close()
    db = null
  }
}
