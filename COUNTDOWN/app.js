const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));
app.use(bodyParser.json());

// Endpoint to trigger the migration
app.post('/migrate', (req, res) => {
    const { svnUrl, gitDir } = req.body;

    if (!svnUrl || !gitDir) {
        return res.status(400).json({ message: 'Invalid input.' });
    }

    const scriptPath = path.join(__dirname, 'migrate.sh');
    const command = `${scriptPath} "${svnUrl}" "${gitDir}"`;

    // Execute the shell script
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ message: 'Migration failed.' });
        }
        res.json(JSON.parse(stdout));
    });
});

// Endpoint to fetch commit history
app.get('/commits', (req, res) => {
    fs.readFile('./commits.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading commit data' });
        }
        res.json(JSON.parse(data));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
