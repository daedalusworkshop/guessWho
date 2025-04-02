const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imageDir)
                .filter(file => file.endsWith('.jpg'));

// Remove the .jpg extension
const usernames = files.map(file => file.replace('.jpg', ''));

console.log(JSON.stringify(usernames, null, 2)); 