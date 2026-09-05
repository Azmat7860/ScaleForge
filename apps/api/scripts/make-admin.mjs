import "dotenv/config";
import mongoose from "mongoose";

const [, , email] = process.argv;
const mongoUri =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/scaleforge";

if (!email) {
  console.error(
    "Usage: npm run make:admin --workspace @scaleforge/api -- user@example.com"
  );
  process.exit(1);
}

try {
  await mongoose.connect(mongoUri);

  const result = await mongoose.connection.collection("users").updateOne(
    { email: email.toLowerCase() },
    { $set: { role: "admin" } }
  );

  if (result.matchedCount === 0) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  console.log(`Updated ${email.toLowerCase()} to admin`);
} catch (error) {
  console.error("Failed to promote user to admin", error);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
