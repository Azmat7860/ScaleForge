import http from "node:http";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const apiWorkdir = resolve(projectRoot, "apps/api");

const balancerPort = 5000;
const targets = [
  { host: "127.0.0.1", port: 5001, label: "api-1" },
  { host: "127.0.0.1", port: 5002, label: "api-2" }
];

let nextTargetIndex = 0;
const childProcesses = [];

const tsNodeDevBinary = resolve(
  projectRoot,
  process.platform === "win32"
    ? "node_modules/.bin/ts-node-dev.cmd"
    : "node_modules/.bin/ts-node-dev"
);

const pickTarget = () => {
  const target = targets[nextTargetIndex % targets.length];
  nextTargetIndex += 1;
  return target;
};

const startApiInstance = (port) => {
  const child = spawn(
    tsNodeDevBinary,
    ["--respawn", "--transpile-only", "src/server.ts"],
    {
      cwd: apiWorkdir,
      env: {
        ...process.env,
        PORT: String(port)
      },
      stdio: "inherit"
    }
  );

  childProcesses.push(child);
};

const proxyRequest = (req, res, attempt = 0) => {
  const target = targets[(nextTargetIndex + attempt) % targets.length] ?? pickTarget();
  if (attempt === 0) {
    nextTargetIndex = (nextTargetIndex + 1) % targets.length;
  }

  const request = http.request(
    {
      host: target.host,
      port: target.port,
      method: req.method,
      path: req.url,
      headers: {
        ...req.headers,
        host: `${target.host}:${target.port}`,
        "x-forwarded-for": req.socket.remoteAddress ?? "",
        "x-forwarded-proto": "http",
        "x-forwarded-host": req.headers.host ?? `localhost:${balancerPort}`
      }
    },
    (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode ?? 502, proxyResponse.headers);
      proxyResponse.pipe(res);
    }
  );

  request.on("error", (error) => {
    if (attempt < targets.length - 1) {
      proxyRequest(req, res, attempt + 1);
      return;
    }

    res.writeHead(502, {
      "content-type": "application/json"
    });
    res.end(
      JSON.stringify({
        success: false,
        message: "Local load balancer could not reach any API instance",
        error: error.message
      })
    );
  });

  req.pipe(request);
};

const server = http.createServer((req, res) => {
  if (req.url === "/__lb/health") {
    res.writeHead(200, {
      "content-type": "application/json"
    });
    res.end(
      JSON.stringify({
        success: true,
        message: "Local load balancer is running",
        port: balancerPort,
        targets
      })
    );
    return;
  }

  proxyRequest(req, res);
});

startApiInstance(5001);
startApiInstance(5002);

server.listen(balancerPort, () => {
  console.log(
    `[scaleforge-lb] Local load balancer running on http://localhost:${balancerPort}`
  );
  console.log(
    `[scaleforge-lb] Routing requests between ${targets
      .map((target) => `${target.label}:${target.port}`)
      .join(", ")}`
  );
});

const shutdown = () => {
  server.close();

  for (const child of childProcesses) {
    child.kill("SIGTERM");
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
