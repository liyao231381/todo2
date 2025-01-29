// src/app/api/todos/route.js
import { NextResponse } from 'next/server';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';
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
    const searchParams = new URL(req.url).searchParams;
    const tagFilter = searchParams.get('tag');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const completedFilter = searchParams.get('completed') === 'false' ? false : null;
    const searchKeyword = searchParams.get('search');
    const dueDate = searchParams.get('dueDate');

    let query = 'SELECT * FROM app_todos WHERE userId = $1';
    const values = [userId];

    if(tagFilter) {
        query += ` AND tags LIKE '%${tagFilter}%'`;
    }

    if(completedFilter !== null) {
      query += ` AND completed = $${values.length + 1}`;
      values.push(completedFilter);
    }

     if (searchKeyword) {
          query += ` AND (title LIKE '%${searchKeyword}%' OR description LIKE '%${searchKeyword}%')`;
      }

      if (dueDate) {
        query += ` AND dueDate = $${values.length + 1}`;
        values.push(dueDate);
      }

      if (sortBy) {
          query += ` ORDER BY ${sortBy} ${sortOrder || 'ASC'}`;
        }

    try {
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


export async function POST(req) {
   const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const { title, description, tags, dueDate, priority } = await req.json();
    const id = uuidv4();

    if (!title) {
        return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    try {
      const result = await pool.query(
          'INSERT INTO app_todos (id, title, description, tags, dueDate, priority, userId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [id, title, description, tags, dueDate, priority, userId]
      );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error adding todo:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const { id, title, description, tags, dueDate, priority } = await req.json();

    if (!id || !title) {
        return NextResponse.json({ message: 'ID and title are required' }, { status: 400 });
    }

    try {
      const result = await pool.query(
        'UPDATE app_todos SET title = $1, description = $2, tags = $3, dueDate = $4, priority = $5 WHERE id = $6 AND userId = $7 RETURNING *',
        [title, description, tags, dueDate, priority, id, userId]
      );
       if (result.rowCount === 0) {
         return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
      return NextResponse.json(result.rows[0]);
     } catch (error) {
       console.error('Error updating todo:', error);
       return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const token = req.headers.get('authorization')?.split(' ')[1];
       if (!token) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
       }

     const decodedToken = verifyToken(token);
     if (!decodedToken || !decodedToken.userId) {
         return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }

     const userId = decodedToken.userId;
  const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }
    try {
      const result = await pool.query('DELETE FROM app_todos WHERE id = $1 AND userId = $2 RETURNING *', [id, userId]);
        if (result.rowCount === 0) {
          return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Todo deleted successfully', deletedTodo: result.rows[0] });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
