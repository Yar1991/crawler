const proc = require("process");
const { crawlPage } = require("./crawl");
const { saveReport } = require("./report");

async function main() {
  try {
    if (proc.argv.length !== 3) {
      throw Error("Incorrect number of arguments");
    }
    new URL(proc.argv.at(-1));
    const baseUrl = new URL(proc.argv.at(-1));
    const result = await crawlPage(baseUrl, baseUrl, [{}, {}]);
    saveReport(result);
  } catch (err) {
    console.log(err.message);
  }
}

main();
