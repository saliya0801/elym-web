const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "public");
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  const resolved = path.normalize(path.join(root, relative));
  return resolved.startsWith(root) ? resolved : null;
}

const server = http.createServer((req, res) => {
  let file = safePath(req.url || "/");
  if (!file) {
    res.writeHead(400);
    return res.end("Bad request");
  }

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }

  fs.readFile(file, (err, body) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    res.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
      "cache-control": "public, max-age=60"
    });
    res.end(body);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`elym-web listening on ${port}`);
});
