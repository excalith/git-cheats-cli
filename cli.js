#!/usr/bin/env node
const chalk = require('chalk');
const getJSON = require('get-json')
const opn = require('opn');
const ora = require('ora')

const jsonLink = "https://raw.githubusercontent.com/excalith/Git-Cheats/master/assets/commands.json";
let cmd = process.argv[2];
let bar = chalk.green("║ ");

// Check Arguments
if (cmd == "-h" || cmd == "--help") {
    ShowHelp();
}
else if (cmd == "-l" || cmd == "--launch") {
    LaunchBrowser(process.argv[3]);
}
else if (cmd) {
    FetchCommand(process.argv[2])
}
else {
    LaunchBrowser(false);
}

/**
 * Shows CLI help
 */
function ShowHelp() {
    console.log("");
    console.log("A Terminal App For Reaching Gitcheats.com Easily");
    console.log("");
    console.log("Commands:");
    console.log("gitcheats " + chalk.yellow("[command]") + "                    Print command descriptions right into your terminal");
    console.log("gitcheats " + chalk.green("-l --launch") + chalk.yellow(" [command]") + "        Launch GitCheats.com in browser with your command filtered");
    console.log("gitcheats " + chalk.green("-h --help") + "                    Display this help");
}

/**
 * Fetch command from original gitcheats json
 *
 * @param  {String} cmd Command to search for within json file
 */
function FetchCommand(cmd) {
    const spinner = ora({
        text: chalk.bold("Fetching '" + chalk.yellow(cmd) + "' from gitcheats.com"),
        color: 'green',
        interval: 80,
        spinner: "dots"
    }).start();

    getJSON(jsonLink, function (error, json) {
        let data = json.commands[cmd];
        console.log("\n");

        if (data == null) {
            spinner.fail("Command '" + chalk.red(cmd) + "' not found in gitcheats.com");
            console.log(chalk.gray("Please consider contributing https://github.com/excalith/Git-Cheats"))
        }
        else {
            LogCommand(cmd, data.desc.en);

            data.options.forEach(element => {
                LogCommand(element.code, element.desc.en);
            });
        }
        spinner.stop();
    })
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
    if (hasCommand)
        opn("www.gitcheats.com?c=" + process.argv[3])
    else
        opn("www.gitcheats.com")
}