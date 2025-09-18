const express = require('express');
const app = express();

app.get('/test-image', (req, res) => {
    const imageUrl = 'https://picsum.photos/800/600?random=' + Date.now();
    res.send(`
        <html>
            <head><title>Random Image Test</title></head>
            <body>
                <h1>Random Image from Picsum Photos</h1>
                <img src="${imageUrl}" alt="Random Picsum Image" style="max-width: 100%; height: auto;" />
                <p>Refresh the page to load a new image.</p>
            </body>
        </html>
    `);
});

app.listen(4000, () => {
    console.log('Test image server running on http://localhost:4000/test-image');
});
