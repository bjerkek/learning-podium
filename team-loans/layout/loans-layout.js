const express = require('express');
const Layout = require('@podium/layout');
const utils = require('@podium/utils');

const app = express();

const domain = 'http://localhost';
const port = '7000';
const url = `${domain}:${port}/loans`;

const layout = new Layout({
    name: 'loansLayout',
    pathname: '/loans',
});

layout.view((incoming, content) => {
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

const headerPodlet = layout.client.register({
    name: 'headerPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

const myLoansPodlet = layout.client.register({
    name: 'myLoansPodlet',
    uri: 'http://localhost:7300/manifest.json',
});

const feedbackPodlet = layout.client.register({
    name: 'feedbackPodlet',
    uri: 'http://localhost:7200/manifest.json',
});

app.use(layout.middleware());

app.get('/loans', async (req, res) => {
    const incoming = res.locals.podium;

    const [header, myLoans, feedback] = await Promise.all([
        headerPodlet.fetch(incoming),
        myLoansPodlet.fetch(incoming),
        feedbackPodlet.fetch(incoming)
    ]);
    
    incoming.podlets = [header, myLoans, feedback];
    incoming.view.title = 'Loans';

    res.podiumSend(`
        ${header}
        ${myLoans}
        ${feedback}
    `);
});

app.listen(port, () => {
    console.log(url);
});
