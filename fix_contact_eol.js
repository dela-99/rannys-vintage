import { readFileSync, writeFileSync } from "fs";

const path = "src/routes/contact.tsx";
const content = readFileSync(path, "utf8");

// Normalize to LF only, then write with explicit \n
const lines = content.split(/\r?\n/);
writeFileSync(path, lines.join("\n"), "utf8");

// Verify no CRLF remains
const check = readFileSync(path, "utf8");
if (check.includes("\r\n")) {
  console.error("FAILED: CRLF still present in", path);
  process.exit(1);
}
console.log("OK: All line endings are LF in", path);
