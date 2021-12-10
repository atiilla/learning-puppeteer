const puppeteer = require('puppeteer')
const express = require('express')
const app = express();

async function Main(req,res) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();
    await page.goto("https://quotes.toscrape.com/")
    await page.waitForSelector('.col-md-4');
    await page.click('.col-md-4 a')
    await page.waitForSelector('#username')
    await page.type('#username', 'root', { delay: 100 })
    await page.waitForSelector('#password')
    await page.type('#password', 'root123', { delay: 100 })
    await page.goto("https://quotes.toscrape.com/")
    // find quote elements
    const quoteElements = await page.$$('.quote');
    let quotes = [];

  for (const quoteElement of quoteElements) {
    // find text and author elements
    const textElement = await quoteElement.$('.text');
    const authorElement = await quoteElement.$('.author');

    // extract text from both elements
    const text = await page.evaluate(el => el.textContent, textElement);
    const author = await page.evaluate(el => el.textContent, authorElement);

    quotes.push({ text, author });
  }
  res.json(quotes)
}



app.get('/',Main)


app.listen(5000,()=>console.log('running'))