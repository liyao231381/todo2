// src/app/api/todos/completed/route.js
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
      const result = await pool.query(
        'SELECT * FROM app_todos WHERE completed = TRUE AND userId = $1',
        [userId]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching completed todos:', error);
         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
