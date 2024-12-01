import 'dotenv/config'  //loads environment variables from a .env file into your application's process.env
import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(express.json())  // Parse JSON bodies

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//google auth
app.post('/auth', async(req, res) =>{
    try{
        const {user_name, google_id} = req.body;
        
        //query,db; if new, insert, return; if old, return
        const [existingUsers] = await pool.execute(
            'SELECT user_id, user_name FROM users WHERE google_id = ?',
            [google_id]
        );
        if(existingUsers.length === 0){
            const [result] = await pool.execute(
                'INSERT INTO users (user_name, google_id) VALUES (?, ?)',
                [user_name, google_id]
            );
            res.json({
                success: true,
                message: 'new user created',
                user_id: result.user_id,
                user_name: user_name
            })
        }else{
            res.json({
                success: true,
                message: 'user found',
                user_id: existingUsers[0].user_id,
                user_name: existingUsers[0].user_name
            })
        }
        
    }catch(err){
        console.log('backend google auth error:' ,err)
        res.status(500).json({success: false, message: 'Authentication failed'})
    }
})

//isbn search 
app.get('/search/isbn/:isbn', async(req,res) => {
    try {
        const isbn = req.params.isbn.replace(/[-\s]/g, '');
        console.log('1. Received ISBN:', isbn);
        
        // Check database first
        const [existingBooks] = await pool.execute(
            `SELECT b.*, 
                GROUP_CONCAT(l.user_id) as seller_ids
                FROM books b
                LEFT JOIN listings l ON b.book_id = l.book_id
                WHERE b.isbn = ?
                GROUP BY b.book_id`,
            [isbn]
        );

        if(existingBooks.length > 0) {
            const book = existingBooks[0];
            const sellers = book.seller_ids ? book.seller_ids.split(',').map(id => ({ user_id: id })) : [];
            return res.json({
                success: true,
                message: 'books found in database',
                book,
                sellers,
            });
        }

        // Fetch from Open Library API
        const response = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
        );
        
        if(!response.ok) {
            throw new Error('Failed to fetch from Open Library API');
        }

        const data = await response.json();
        const bookData = data[`ISBN:${isbn}`];

        if(!bookData) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const book = {
            isbn: isbn,
            title: bookData.title,
            authors: bookData.authors ? bookData.authors.map(author => author.name).join(', ') : null,
            publish_date: bookData.publish_date,
            publisher: bookData.publishers ? bookData.publishers[0].name : null,
            cover_url: bookData.cover ? bookData.cover.large : null,
            number_of_pages: bookData.number_of_pages,
            edition: bookData.edition_name
        };

        console.log('Book data:', book);
        
        res.json({
            success: true,
            message: 'book found from open library',
            book
        });
        
    } catch(err) {
        console.log('backend search isbn error:', err);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: err.message
        });
    }
});

app.listen(8000,() =>{
    console.log('connected to backend')
})