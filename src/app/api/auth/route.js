// src/app/api/auth/route.js
import { NextResponse } from 'next/server';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
});


export async function POST(req) {
const searchParams = new URL(req.url).searchParams;
 const mode = searchParams.get('mode');

 if(mode === "signup"){
        const { username, password } = await req.json();
           if (!username || !password) {
             return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
          }

         const hashedPassword = await bcrypt.hash(password, 10);

         try {
             const result = await pool.query(
             'INSERT INTO app_users (username, password) VALUES ($1, $2) RETURNING *',
             [username, hashedPassword]
             );
             return NextResponse.json({ message: 'User created successfully', user: result.rows[0] }, { status: 201 });
         } catch (error) {
              if (error.code === '23505') {
                  return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
             }
            console.error('Error creating user:', error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
         }
 }

    if(mode === "login"){
      const { username, password } = await req.json();
      if (!username || !password) {
          return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
      }
       try {
            const result = await pool.query('SELECT * FROM app_users WHERE username = $1', [username]);
          if (result.rows.length === 0) {
              return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
           }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

           if (!passwordMatch) {
              return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

           const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
             return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
      } catch (error) {
             console.error('Error logging in user:', error);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
   }
  return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}
