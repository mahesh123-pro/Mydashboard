import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
// Fail fast instead of sitting on the driver's 30s default — a dashboard that
// can't reach Atlas should fall back to local state in a couple of seconds,
// not hang the request.
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  // Don't throw at the top level so Next.js build doesn't fail
  console.warn('Invalid/Missing environment variable: "MONGODB_URI"');
  clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
  // The route handlers catch this, but attach a no-op so an unused import
  // never surfaces as an unhandled rejection.
  clientPromise.catch(() => {});
} else {
  // Cache on globalThis in every environment. In development this survives HMR
  // module reloads; in production (serverless) it lets warm invocations of the
  // same lambda reuse the existing connection pool instead of paying a fresh
  // TLS + auth handshake on every request.
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = globalWithMongo._mongoClient.connect();
    // If the initial connect fails, drop the cached promise so the next request
    // retries rather than replaying the same rejection forever.
    globalWithMongo._mongoClientPromise.catch(() => {
      globalWithMongo._mongoClientPromise = undefined;
      globalWithMongo._mongoClient = undefined;
    });
  }

  client = globalWithMongo._mongoClient;
  clientPromise = globalWithMongo._mongoClientPromise;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
export { client };
