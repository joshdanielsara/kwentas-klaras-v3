import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  client = new MongoClient(uri)
  await client.connect()
  
  const databaseName = new URL(uri).pathname.slice(1) || 'test'
  db = client.db(databaseName)

  return db
}

export async function getMongoDB(): Promise<Db> {
  return connectToMongoDB()
}

export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

