#!/usr/bin/env node
const argv = require("yargs")
  .command("$0 <source file> [options]", "convert log file to text or json")
  .alias("t", ["target"])
  .nargs("t", 1)
  .describe("t", "define target json or text")
  .choices("t", ["json", "text"])
  .demand(1)
  .alias("o", ["output"])
  .nargs("o", 1)
  .describe("o", "output directory")
  .help("h")
  .alias("h", "help").argv;

const fs = require("fs");
let target = argv.target || "text";
let output = argv.output || "./temp.txt";
let i = 0;
fs.readFile(argv.sourcefile, "utf-8", (err, data) => {
  let modifiedData = data;
  if (target === "json") {
    if (output === "./temp.txt") output = "./temp.json";
    const split = data.split("\n");
    const jsonData = split.map((item) => {
      var separators = [" - - ", "] ", '"-"', '"', " 0 ", " /"];
      const results = item.split(new RegExp(separators.join("|"), "g"));
      const [
        ip,
        time,
        emplty0,
        method,
        endpoint,
        response,
        empty1,
        empty2,
        machine,
      ] = results;
      return {
        ip,
        time: time.slice(1),
        method,
        endpoint: "/" + endpoint,
        response: Number(response),
        machine,
      };
    });
    modifiedData = JSON.stringify(jsonData);
  }
  fs.writeFileSync(output, modifiedData, (err) => {
    if (err) console.log(err);
    console.log(`Successfully Written to ${target} File.`);
  });
});

console.log(`Successfully Written to ${target} File.`);
