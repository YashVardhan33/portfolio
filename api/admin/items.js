import { verifyToken } from '../lib/auth';
import { connectToDatabase } from '../lib/mongodb';
export default async function handler(req, res) {
  try {
    // Verify admin token
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const items = await db
          .collection('portfolio')
          .find({})
          .sort({ order: 1 })
          .toArray();
        res.status(200).json(items);
        break;

      case 'POST':
        const newItem = req.body;
        const result = await db
          .collection('portfolio')
          .insertOne({
            ...newItem,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        res.status(201).json({ _id: result.insertedId, ...newItem });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
