const { JSDOM } = require("jsdom");

const urlsFromHTML = (HTMLstring, baseUrl) => {
  const DOM = new JSDOM(HTMLstring);
  const DOC = DOM.window.document;
  const allUrls = [];

  const allLinks = [...DOC.querySelectorAll("a")];
  allLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    const newUrl = linkPath.startsWith("/")
      ? new URL(
          `${
            baseUrl.href.endsWith("/")
              ? baseUrl.href.slice(0, -1)
              : baseUrl.href
          }${linkPath}`
        )
      : new URL(linkPath.endsWith("/") ? linkPath.slice(0, -1) : linkPath);
    allUrls.push(newUrl);
  });

  return allUrls;
};

const crawlPage = async (baseUrl, currentUrl, pages) => {
  const normalized = `${currentUrl.hostname}${currentUrl.pathname}`;
  if (baseUrl.hostname !== currentUrl.hostname) {
    if (pages[1][normalized]) {
      pages[1][normalized] += 1;
      return pages;
    }
    pages[1][normalized] = 1;
    return pages;
  } else {
    if (pages[0][normalized]) {
      pages[0][normalized] += 1;
      return pages;
    }
    pages[0][normalized] = 1;
  }

  try {
    const res = await fetch(currentUrl.href);
    if (!res.ok) {
      console.log(res.statusText);
      return pages;
    }
    if (!res.headers.get("content-type").includes("text/html")) {
      console.log("Incorrect data format received");
      return pages;
    }
    const resHTML = await res.text();
    const foundUrls = urlsFromHTML(resHTML, baseUrl);
    for (let url of foundUrls) {
      pages = await crawlPage(baseUrl, url, pages);
    }
    return pages;
  } catch (err) {
    console.log(`${err}\n`);
  }
};

module.exports = {
  urlsFromHTML,
  crawlPage,
};
