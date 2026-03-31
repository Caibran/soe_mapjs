const fs = require('fs');
const path = require('path');

const mapsDir = path.join(__dirname, '..', 'maps');
const outputDir = path.join(__dirname, '..', 'dist', 'web');
const outputFile = path.join(outputDir, 'maps.json');

if (!fs.existsSync(mapsDir)) {
    console.error('Maps directory not found:', mapsDir);
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Generating map index from:', mapsDir);

const files = fs.readdirSync(mapsDir)
    .filter(file => file.endsWith('.emf'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const mapIndex = files.map(file => {
    const id = file.replace('.emf', '');
    return {
        id,
        filename: file
    };
});

fs.writeFileSync(outputFile, JSON.stringify(mapIndex, null, 2));

console.log(`Generated map index with ${mapIndex.length} maps at: ${outputFile}`);
