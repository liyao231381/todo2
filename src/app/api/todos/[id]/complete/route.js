// src/app/api/todos/[id]/complete/route.js
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

export async function PATCH(req, { params }) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const { id } = params;
    const { completed } = await req.json();

    if (typeof completed !== 'boolean') {
        return NextResponse.json({ message: 'Completed status must be a boolean' }, { status: 400 });
    }

    try {
      const result = await pool.query(
          'UPDATE app_todos SET completed = $1 WHERE id = $2 AND userId = $3 RETURNING completed',
          [completed, id, userId]
        );
        if(result.rowCount === 0){
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
         }
        return NextResponse.json({completed: result.rows[0].completed} , {status: 200});
    } catch (error) {
        console.error('Error updating todo completion status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
