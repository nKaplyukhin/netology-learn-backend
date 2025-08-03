const express = require('express');
const redis = require('redis');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost"

const client = redis.createClient({
    url: REDIS_URL
});

(async () => {
    await client.connect()
})()

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

app.post('/counter/:id/incr', async (req, res) => {
    const { id } = req.params;
    try {
        await client.incr(`book:${id}`);
        res.status(200).json({ message: `просмотр ${id} увеличен` });
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка' });
    }
});

app.get('/counter/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const count = await client.get(`book:${id}`);
        res.status(200).json({ id, count: parseInt(count || 0) });
    } catch (err) {
        res.status(500).json({ error: 'Произошла ошибка' });
    }
});

app.listen(PORT, () => {
    console.log(`Server start on ${PORT} port`);
  });
  