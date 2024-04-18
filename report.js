const fs = require("fs");
const { stringify } = require("csv-stringify");

const saveReport = (pages) => {
  const [internalLinks, externalLinks] = pages;

  const convertedInternalLinks = convert2D(internalLinks);
  const convertedExternalLinks = convert2D(externalLinks);

  try {
    if (convertedInternalLinks.length) {
      const csvInternal = stringify(convertedInternalLinks);
      const streamInternal = fs.createWriteStream("internal_links.csv");
      csvInternal.pipe(streamInternal);
    }

    if (convertedExternalLinks.length) {
      const csvExternal = stringify(convertedExternalLinks);
      const streamExternal = fs.createWriteStream("external_links.csv");
      csvExternal.pipe(streamExternal);
    }
  } catch (err) {
    console.log(err);
  }
};

const convert2D = (obj) => {
  if (!Object.keys(obj).length) {
    return [];
  }
  const arr2D = [];
  arr2D.push(["url", "count"]);
  for (let key in obj) {
    arr2D.push([key, obj[key]]);
  }
  return arr2D;
};

module.exports = {
  saveReport,
};
