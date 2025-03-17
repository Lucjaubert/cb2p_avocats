import '@angular/compiler'; // requis pour SSR avec certaines lib Angular
import 'zone.js/node';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CommonEngine } from '@angular/ssr';
import { APP_BASE_HREF } from '@angular/common';
import bootstrap from './bootstrap-proxy.cjs'; // ✅ chemin relatif ok car __dirname est défini

// 🔁 Pour corriger les chemins avec ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Chemin absolu basé sur le vrai dossier courant
const DIST_FOLDER = '/var/www/lucjaubert_c_usr14/data/www/dev.cb2p-avocats.fr/cb2p_angular/browser';

const app = express();

// 👉 Sert les fichiers statiques Angular compilés
app.use(express.static(DIST_FOLDER, { maxAge: '1y' }));

// 👉 Proxy vers l’API WordPress Headless
app.use('/wp-json', async (req, res) => {
  try {
    const response = await fetch(`https://dev.cb2p-avocats.fr/wp-json${req.url}`);
    if (!response.ok) {
      throw new Error(`Erreur API ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur API WordPress:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données WordPress' });
  }
});


// 👉 Rendu SSR
app.get('*', async (req, res) => {
  const engine = new CommonEngine();
  try {
    const html = await engine.render({
      bootstrap, // 👈 injection SSR
      documentFilePath: join(DIST_FOLDER, 'index.html'),
      url: req.originalUrl,
      publicPath: DIST_FOLDER,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
    res.status(200).send(html);
  } catch (err) {
    console.error('❌ Erreur lors du rendu SSR', err);
    res.status(500).send('Une erreur est survenue');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Serveur Angular SSR démarré sur http://localhost:${PORT}`);
});
