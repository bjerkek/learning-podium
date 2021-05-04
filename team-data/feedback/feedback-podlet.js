const express = require('express');
const Podlet = require('@podium/podlet');
const utils = require('@podium/utils');
const fs = require('fs');

const app = express();

const domain = 'http://localhost';
const port = '7200';
const url = `${domain}:${port}`;

const podlet = new Podlet({
    name: 'feedback',
    version: '1.0.0',
    pathname: '/',
    manifest: '/manifest.json',
    content: '/',
    fallback: '/fallback',
    development: true,
});

podlet.view((incoming, content) => {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            ${incoming.css.map(utils.buildLinkElement).join('\n')}
            <title>${incoming.view.title}</title>
        </head>
        <body>
            ${content}
            ${incoming.js.map(utils.buildScriptElement).join('\n')}
        </body>
    </html>`;
});


app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <div id="feedbackPodlet"></div>
    `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

const assetsFolder = 'dist'
app.use('/assets', express.static(assetsFolder));

fs.readdir(`${assetsFolder}/css`, (err, files) => {
    files.forEach(filename => {
        podlet.css({ value: `${url}/assets/css/${filename}` });
    });
});

fs.readdir(`${assetsFolder}/js`, (err, files) => {
    files.forEach(filename => {
        podlet.js({ value: `${url}/assets/js/${filename}` });
    });
});

app.listen(port, () => {
    console.log(url);
});
