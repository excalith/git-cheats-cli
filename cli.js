#!/usr/bin/env node
const chalk = require("chalk");
const getJSON = require("get-json");
const opn = require("opn");
const ora = require("ora");
const Configstore = require("configstore");
const pkg = require("./package.json");
const jsonLink =
  "https://raw.githubusercontent.com/excalith/Git-Cheats/master/assets/commands.json";
const conf = new Configstore(pkg.name, { lang: "en" });

let cmd = process.argv[2];
let bar = chalk.green("║ ");
let lang = conf.get("lang");

// Check Arguments
if (cmd == "-h" || cmd == "--help") {
  ShowHelp();
} else if (cmd == "-o" || cmd == "--open") {
  LaunchBrowser(process.argv[3]);
} else if (cmd == "-l" || cmd == "--language") {
  SetLanguage(process.argv[3]);
} else if (cmd) {
  FetchCommand(process.argv[2]);
} else {
  LaunchBrowser(false);
}

/**
 * Shows CLI help
 */
function ShowHelp() {
  console.log(
    chalk.white.bold("\nGitCheats CLI - A Companion For GitCheats\n")
  );
  console.log(chalk.white.bold("Commands:"));
  console.log("gitcheats".padEnd(39) + "Open gitcheats.com in browser");
  console.log(
    "gitcheats " +
      chalk.yellow("[command]").padEnd(39) +
      "Print command descriptions right into your terminal"
  );
  console.log(
    "gitcheats " +
      chalk.green("-o --open") +
      chalk.yellow(" [command]").padEnd(30) +
      "Open gitcheats.com in browser with your command filtered"
  );
  console.log(
    "gitcheats " +
      chalk.green("-l --language") +
      chalk.yellow(" [key]").padEnd(26) +
      "Set your preffered language (Default: en)"
  );
  console.log(
    "gitcheats " + chalk.green("-h --help").padEnd(39) + "Display this help"
  );
}

/**
 * Fetch command from original gitcheats json
 *
 * @param  {String} cmd Command to search for within json file
 */
function FetchCommand(cmd) {
  const spinner = ora({
    text: chalk.white.bold(
      "Fetching " +
        chalk.green(cmd) +
        " from " +
        chalk.blue("http://gitcheats.com")
    ),
    color: "green",
    interval: 80,
    spinner: "dots"
  }).start();

  getJSON(jsonLink, function(error, json) {
    let data = json.commands[cmd];
    console.log("\n");

    if (data == null) {
      spinner.fail("Command " + chalk.red(cmd) + " not found in gitcheats.com");
      spinner.info(
        chalk.gray(
          "If gitcheats is missing a command, please consider contributing " +
            chalk.blue("https://github.com/excalith/Git-Cheats")
        )
      );
    } else {
      LogCommand(cmd, data.desc[lang]);

      data.options.forEach(element => {
        LogCommand(element.code, element.desc[lang]);
      });
    }

    spinner.stop();
  });
}

/**
 * Check if language exists and set it to given key
 *
 * @param  {String} key Language key
 */
function SetLanguage(key) {
  const spinner = ora({
    text: chalk.white.bold("Fetching Language: " + key),
    color: "green",
    interval: 80,
    spinner: "dots"
  }).start();

  getJSON(jsonLink, function(error, json) {
    let data = json.settings.languages[key];
    console.log("\n");

    if (data == null) {
      spinner.fail("Language not found. Available languages:");
      Object.keys(json.settings.languages).forEach(function(key) {
        console.log(
          key.padStart(4) + ": ".padStart(5) + json.settings.languages[key]
        );
      });
    } else {
      conf.set("lang", key);
      spinner.succeed("Language set to " + data + "\n");
    }

    spinner.stop();
  });
}

/**
 * Print command and description into terminal
 *
 * @param  {String} command Command title
 * @param  {String} description Command description
 */
function LogCommand(command, description) {
  console.log(bar + chalk.green.bold("> git " + command));
  console.log(bar + description);
  console.log(bar);
}

/**
 * Fetch command from original gitcheats json
 *
 * @param  {boolean} hasCommand Checks if argv has a git command
 */
function LaunchBrowser(hasCommand) {
  if (hasCommand) {
    let command = process.argv[3];
    console.log(
      chalk.white.bold(
        "Launching " +
          chalk.green(command) +
          " on " +
          chalk.blue("http://gitcheats.com")
      )
    );
    opn("http://gitcheats.com?c=" + command);
  } else {
    console.log(
      chalk.white.bold("Launching " + chalk.blue("http://gitcheats.com"))
    );
    opn("http://gitcheats.com");
  }
}
