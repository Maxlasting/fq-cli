#!/usr/bin/env node
const program = require('commander')
const download = require('download-git-repo')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const fs = require('fs')

const url = 'https://github.com:Maxlasting/vue-ssr-template#master'

const commands = [
  {
    name: 'description',
    message: 'entry description of project'
  },
  {
    name: 'author',
    message: 'entry author of project'
  }
]

program

  .version('1.0.4', '-v, --version')

  .command('init [query] <name>')

  .option('vue-ssr')

  .action( async (query, name) => {
    if (!fs.existsSync(name)) {
      if (query !== 'vue-ssr') return console.error('Query now only be vue-ssr!')

      const answers = await inquirer.prompt(commands)

      const spinner = ora('download template ...')

      spinner.start()

      download(
        url, 
        name,
        { clone: true },
        err => {
          if (err) {
            spinner.fail()
            console.error(symbols.error, chalk.red(err))
            return
          }

          spinner.succeed()

          const fileName = `${name}/package.json`

          const meta = {
            name,
            description: answers.description,
            author: answers.author
          }

          if (fs.existsSync(fileName)) {
            const content = fs.readFileSync(fileName).toString()
            const result = handlebars.compile(content)(meta)
            fs.writeFileSync(fileName, result);
          }

          console.log(symbols.success, chalk.green('template init ok!'))
        }
      )
    } else {
      console.error(symbols.error, chalk.red('The project has already created!'))
    }
  })

program.parse(process.argv)


