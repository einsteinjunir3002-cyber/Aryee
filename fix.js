const fs = require('fs');
const fix = (path) => {
    let content = fs.readFileSync(path, 'utf8');
    const lastIdx = content.lastIndexOf('document.addEventListener(" DOMContentLoaded\\,');
    if (lastIdx !== -1) {
        fs.writeFileSync(path, content.substring(0, lastIdx));
        console.log('Fixed', path);
    }
};
fix('c:/Users/einst/Desktop/Ofei/script.js');
fix('c:/Users/einst/Desktop/Ofei/BESTIE/game.js');
