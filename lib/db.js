import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://ivan:medved1993@cluster0.f3887.mongodb.net/auth?retryWrites=true&w=majority`
    // `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.f3887.mongodb.net/auth?retryWrites=true&w=majority`
  );

  return client;
}
