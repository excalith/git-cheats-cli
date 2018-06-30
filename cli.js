#!/usr/bin/env node
const chalk = require('chalk');
const Table = require('cli-table');
const getJSON = require('get-json')
const opn = require('opn');
const ora = require('ora')

let cmd = process.argv[2];


if (cmd == "-h" || cmd == "--help") {
    ShowHelp();
}
else if (cmd == "-l" || cmd == "--launch") {
    opn("www.gitcheats.com?c=" + process.argv[3])
}
else if (cmd) {
    GetCommand(process.argv[2])
}
else {
    opn("www.gitcheats.com")
}

function ShowHelp() {
    console.log("");
    console.log("A Terminal App For Reaching Gitcheats.com Easily");
    console.log("");
    console.log("Commands:");
    console.log("gitcheats " + chalk.blue("[command]") + "                    Print command descriptions right into your terminal");
    console.log("gitcheats " + chalk.green("-l --launch") + chalk.blue(" [command]") + "        Launch GitCheats.com in browser with your command filtered");
    console.log("gitcheats " + chalk.green("-h --help") + "                    Display this help");
}

function GetCommand(cmd) {
    console.log("\n");
    const spinner = ora().start();
    spinner.color = 'blue';
    spinner.text = chalk.blue("Fetching '" + chalk.green(cmd) + "' from gitcheats.com");

    getJSON('https://raw.githubusercontent.com/excalith/Git-Cheats/master/assets/commands.json', function (error, json) {
        let data = json.commands[cmd];
        console.log("\n\n");

        if (data == null) {
            console.log("Command " + chalk.red(cmd) + " not found in gitcheats.com");
            console.log(chalk.gray("Please consider contributing " + "https://github.com/excalith/Git-Cheats"))
        }
        else {
            var table = new Table({
                head: [chalk.green.bold('Option'), chalk.green.bold('Description')],
                colWidths: [60, 220],
                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                    'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
                    'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
                    'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
                }
            });

            table.push(
                [cmd, data.desc.en]
            );

            data.options.forEach(element => {
                table.push(
                    [element.code, element.desc.en]
                );
            });

            console.log(table.toString());
        }

        spinner.stop();
    })
}