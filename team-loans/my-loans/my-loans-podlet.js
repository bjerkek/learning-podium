const express = require('express');
const Podlet = require('@podium/podlet');
const utils = require('@podium/utils');
const fs = require('fs');

const app = express();

const domain = 'http://localhost';
const port = '7300';
const url = `${domain}:${port}`;

const podlet = new Podlet({
    name: 'my-loans',
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
        <div id="myLoansPodletRoot"></div>
    `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.use('/assets', express.static('build/static'));

const reactAssetManifest = fs.readFileSync("build/asset-manifest.json");
const assets = JSON.parse(reactAssetManifest);

assets.entrypoints.forEach(element => {
    const filename = element.replace('static', `${url}/assets`);
    if (element.includes('.css')) {
        podlet.css({ value: filename });
    }

    if (element.includes('.js')) {
        podlet.js({ value: filename });
    }
});

app.listen(port, () => {
    console.log(url);
});
