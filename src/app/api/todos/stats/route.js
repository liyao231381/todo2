// src/app/api/todos/stats/route.js
import { NextResponse } from 'next/server';
import pkg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
 });


function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
     return null;
  }
}


export async function GET(req) {
   const token = req.headers.get('authorization')?.split(' ')[1];
       if (!token) {
           return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;

  try {
    const totalResult = await pool.query(
        'SELECT COUNT(*) FROM app_todos WHERE userId = $1', [userId]
      );
      const completedResult = await pool.query(
          'SELECT COUNT(*) FROM app_todos WHERE completed = TRUE AND userId = $1', [userId]
       );
    const pendingResult = await pool.query(
          'SELECT COUNT(*) FROM app_todos WHERE completed = FALSE AND userId = $1', [userId]
     );
      const priorityResult = await pool.query(
          'SELECT priority, COUNT(*) FROM app_todos WHERE userId = $1 GROUP BY priority', [userId]
     );

     const tagResult = await pool.query(
         `SELECT unnest(string_to_array(tags, ',')) AS tag, COUNT(*)
            FROM app_todos WHERE userId = $1
            GROUP BY tag`, [userId]
      );


        const total = parseInt(totalResult.rows[0].count, 10);
       const completed = parseInt(completedResult.rows[0].count, 10);
     const pending = parseInt(pendingResult.rows[0].count, 10);
       const priorityCounts = priorityResult.rows.map(row => ({
            priority: row.priority,
            count: parseInt(row.count, 10),
        }));
     const tagCounts = tagResult.rows.map(row => ({
            tag: row.tag.trim(),
          count: parseInt(row.count, 10)
       }));

      return NextResponse.json({
        total,
        completed,
         pending,
        priorityCounts,
       tagCounts,
    });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
