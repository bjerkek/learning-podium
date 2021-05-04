const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const domain = 'http://localhost';
const port = '7100';
const url = `${domain}:${port}`;

const podlet = new Podlet({
    name: 'header',
    version: '1.0.0',
    pathname: '/',
    manifest: '/manifest.json',
    content: '/',
    fallback: '/fallback',
    development: true,
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <header>This is our nice header</header>
    `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(port, () => {
    console.log(url);
});
