import { connectToDatabase } from "../lib/mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const item = await db
      .collection('portfolio')
      .findOne({ id: id, isActive: true });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
