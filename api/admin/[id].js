import { ObjectId } from 'mongodb';
import { verifyToken } from '../lib/auth';
import { connectToDatabase } from '../lib/mongodb';
export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // Verify admin token
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();

    switch (req.method) {
      case 'PUT':
        const updateData = req.body;
        await db
          .collection('portfolio')
          .updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                ...updateData,
                updatedAt: new Date()
              }
            }
          );
        res.status(200).json({ message: 'Item updated successfully' });
        break;

      case 'DELETE':
        await db
          .collection('portfolio')
          .deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Item deleted successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
