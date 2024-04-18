const { test, expect } = require("@jest/globals");
const { urlsFromHTML } = require("./crawl");
const { saveReport } = require("./report");

const fs = require("fs");
const writeSyncSpy = jest.spyOn(fs, "createWriteStream");

test("saves report as two CSV files with both internal and external links", () => {
  const exampleReport = [
    {
      "https://some-link.com": 1,
      "https://some-link.com/bla": 2,
    },
    {
      "https://other-link.com": 1,
      "https://other-link.com/other": 1,
    },
  ];

  saveReport(exampleReport);
  expect(writeSyncSpy).toHaveBeenCalledTimes(2);
  expect(writeSyncSpy).toHaveBeenCalledWith("internal_links.csv");
  expect(writeSyncSpy).toHaveBeenCalledWith("external_links.csv");
});

test("takes a string representing HTML document and returns a list of all URLs from that document", () => {
  const exampleHtmlOne = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Some fancy site</title>
      </head>
      <body>
        <header>
          <h1>Some Heading</h1>
          <a href="https://fancy-site.com/blog">Check Our Blog</a>
        </header>
        <section>
          <div>
            <p>You can check our product below</p>
            <a href="https://fancy-site.com/products">Check Products</a>
          </div>
        </section>
        <footer>
          <a href="https://fancy-site.com/contacts/social">Check Our Social Medias</a>
        </footer>
      </body>
    </html>
  `;

  const exampleHtmlTwo = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Some other site</title>
      </head>
      <body>
        <div>
          <p>Item one:</p>
          <a href="/items/one">Check Products</a>
        </div>
        <div>
          <p>Item two:</p>
          <a href="/items/two">Check Products</a>
        </div>
        <div>
          <p>Item three:</p>
          <a href="/items/three">Check Products</a>
        </div>
      </body>
    </html>
  `;

  const siteUrlOne = new URL("https://fancy-site.com");
  const siteUrlTwo = new URL("https://buy-stuff.com");

  const listOfUrlsOne = [
    new URL("https://fancy-site.com/blog"),
    new URL("https://fancy-site.com/products"),
    new URL("https://fancy-site.com/contacts/social"),
  ];

  const listOfUrlsTwo = [
    new URL("https://buy-stuff.com/items/one"),
    new URL("https://buy-stuff.com/items/two"),
    new URL("https://buy-stuff.com/items/three"),
  ];

  const resultOne = urlsFromHTML(exampleHtmlOne, siteUrlOne);
  expect(resultOne).toEqual(listOfUrlsOne);

  const resultTwo = urlsFromHTML(exampleHtmlTwo, siteUrlTwo);
  expect(resultTwo).toEqual(listOfUrlsTwo);
});
