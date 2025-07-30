import { connectToDatabase } from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const items = await db
      .collection('portfolio')
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    res.status(200).json(items);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
