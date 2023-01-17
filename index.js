const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.get('/pdf', async (req, res) => {
    try {
        // Launch a headless browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Use the page.goto method to navigate to the URL
        await page.goto(req.query.url, { waitUntil: 'networkidle2' });
        // get the title of the website
        const title = await page.title();

        // set the size of the page
        let width = req.query.width ? req.query.width : '800px';
        let height = req.query.height ? req.query.height : '600px';
        await page.setViewport({ width: parseInt(width), height: parseInt(height) });

        // Use the page.pdf method to generate the PDF
        const pdf = await page.pdf({ format: 'A4' });

        // Close the browser instance
        await browser.close();

        // Set the response headers to return a PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);

        // Send the PDF as the response
        res.send(pdf);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error generating PDF' });
    }
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

