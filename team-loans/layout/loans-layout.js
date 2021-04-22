const express = require('express');
const Layout = require('@podium/layout');
const app = express();

const layout = new Layout({
    name: 'loansLayout',
    pathname: '/loans',
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
    const content = await Promise.all([
        headerPodlet.fetch(incoming),
        myLoansPodlet.fetch(incoming),
        feedbackPodlet.fetch(incoming),
    ]);

    incoming.view.title = 'Loans';
    
    res.podiumSend(`
        <div>
            <div>${content[0]}</div>
            <div>${content[1]}</div>
            <div>${content[2]}</div>
        </div>
    `);
});

app.listen(7000);
