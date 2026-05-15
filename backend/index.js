const pg = require('pg');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

const port=3000;

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 5000
});

console.log("Connecting...:")

const corsOptions = {
    origin: 'http://localhost:8081',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/authenticate/:username/:password', async (request, response) => {
    const username = request.params.username;
    const password = request.params.password;

    const query = `SELECT id, user_name FROM users WHERE user_name=$1 AND password=crypt($2, password)`;
     pool.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('query failed:', error.message);
            return response.status(500).json({ error: 'internal error' });
        }

        if (results.rows.length === 0) {
            return response.status(401).json({ error: 'unauthorized' });
        }

        return response.status(200).json(results.rows[0]);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

