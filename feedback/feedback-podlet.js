const express = require('express');
const Podlet = require('@podium/podlet');

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

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).podiumSend(`
        <div>This is the feedback podlet</div>
    `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(port, () => {
    console.log(url);
});
