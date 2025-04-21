import 'zone.js/node';               // Nécessaire pour Angular Universal
import '@angular/compiler';          // Souvent requis par SSR
import express from 'express';
import { CommonEngine } from '@angular/ssr';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { APP_BASE_HREF } from '@angular/common';

// Si vous utilisez un bootstrap-proxy.cjs (Angular Universal),
import bootstrap from './bootstrap-proxy.cjs';

// Pour fetch
import fetch from 'node-fetch';

// -- Gestion __dirname en ESM --
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -- Chemin vers le dossier Angular compilé (browser) --
const DIST_FOLDER = join(__dirname, 'browser');
// Par exemple : /var/www/lucjaubert_c_usr14/data/www/dev.cb2p-avocats.fr/cb2p_angular/browser
// Adaptez selon votre structure si besoin !

const app = express();

// (1) Servir les fichiers statiques Angular (JS, CSS, assets, etc.)
app.use(express.static(DIST_FOLDER, { maxAge: '1y' }));

// (2) (Optionnel) Proxy interne pour /wp-json
//     Si vous préférez que le client Angular appelle directement
//     https://dev.cb2p-avocats.fr/wordpress/wp-json, vous pouvez retirer ce bloc.
app.use('/wp-json', async (req, res) => {
  try {
    // Appel direct vers WordPress
    const fetchUrl = 'https://cb2p-avocats.fr/wordpress/wp-json' + req.url;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Erreur API WordPress: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur de proxy /wp-json :', error);
    res.status(500).json({ error: 'Erreur interne de proxy vers WordPress' });
  }
});

// (3) Rendu SSR Angular pour toutes les routes
app.get('*', async (req, res) => {
  const engine = new CommonEngine();

  try {
    const html = await engine.render({
      bootstrap,
      documentFilePath: join(DIST_FOLDER, 'index.html'),
      url: req.originalUrl,
      publicPath: DIST_FOLDER,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ]
    });

    res.status(200).send(html);
  } catch (err) {
    console.error('❌ Erreur SSR :', err);
    res.status(500).send('Erreur lors du rendu côté serveur');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Serveur Angular SSR démarré sur http://localhost:${PORT}`);
});
