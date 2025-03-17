#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ✅ Chemin corrigé vers le main.js généré
const mainJsPath = path.join(__dirname, 'server', 'main.js');

// Lire le contenu du fichier
let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

// Injecter les définitions nécessaires
const patchedContent = `
var exports = {};
var module = { exports: exports };
var __webpack_exports__ = {};

${mainJsContent}

module.exports = __webpack_exports__;
`;

// Écrire le fichier temporaire patché
const patchedFilePath = path.join(__dirname, 'patched-main.cjs');
fs.writeFileSync(patchedFilePath, patchedContent);

// Exporter le module corrigé
module.exports = require(patchedFilePath);
