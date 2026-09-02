import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const distDirectory = resolve(rootDirectory, "dist");
const html = readFileSync(resolve(distDirectory, "index.html"), "utf8");
const document = new JSDOM(html).window.document;

const productionUrl = "https://mavericklabs.vercel.app/";
const socialImageUrl = `${productionUrl}images/maverick-labs-social-preview.png`;

function getMetaContent(selector) {
  const element = document.querySelector(selector);

  assert.ok(element, `Missing metadata element: ${selector}`);

  return element.getAttribute("content");
}

assert.equal(document.title, "Maverick Labs | Mega Man X Route Planner");

assert.equal(
  document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
  productionUrl,
);

assert.equal(getMetaContent('meta[property="og:url"]'), productionUrl);

assert.equal(getMetaContent('meta[property="og:image"]'), socialImageUrl);

assert.equal(
  getMetaContent('meta[name="twitter:card"]'),
  "summary_large_image",
);

assert.equal(getMetaContent('meta[name="twitter:image"]'), socialImageUrl);

const socialImagePath = resolve(
  distDirectory,
  "images/maverick-labs-social-preview.png",
);

assert.ok(existsSync(socialImagePath), "Social preview image is missing");

const socialImage = readFileSync(socialImagePath);

assert.equal(socialImage.readUInt32BE(16), 1200);
assert.equal(socialImage.readUInt32BE(20), 630);
assert.ok(
  statSync(socialImagePath).size < 1_000_000,
  "Social preview image must be smaller than 1 MB",
);

for (const icon of ["favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
  assert.ok(
    existsSync(resolve(distDirectory, icon)),
    `Missing built identity asset: ${icon}`,
  );
}

const socialTitle = "Plan smarter Mega Man X routes | Maverick Labs";

const description =
  "Plan Mega Man X stage routes. See how boss weaknesses, collectibles, and stage order affect difficulty, backtracking, estimated time, and recommendations.";

assert.equal(getMetaContent('meta[name="description"]'), description);

assert.equal(getMetaContent('meta[property="og:title"]'), socialTitle);

assert.equal(getMetaContent('meta[property="og:description"]'), description);

assert.equal(getMetaContent('meta[property="og:image:width"]'), "1200");

assert.equal(getMetaContent('meta[property="og:image:height"]'), "630");

assert.equal(
  getMetaContent('meta[property="og:image:alt"]'),
  "Maverick Labs: Plan smarter Mega Man X routes",
);

assert.equal(getMetaContent('meta[name="twitter:title"]'), socialTitle);

assert.equal(getMetaContent('meta[name="twitter:description"]'), description);

assert.equal(
  getMetaContent('meta[name="twitter:image:alt"]'),
  "Maverick Labs: Plan smarter Mega Man X routes",
);

assert.equal(
  socialImage.subarray(0, 8).toString("hex"),
  "89504e470d0a1a0a0a".slice(0, 16),
);

const pngSignature = "89504e470d0a1a0a";

assert.equal(
  socialImage.subarray(0, 8).toString("hex"),
  pngSignature,
);

console.log("SEO metadata and social assets verified.");
