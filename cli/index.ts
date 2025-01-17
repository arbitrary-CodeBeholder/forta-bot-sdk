#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import configureContainer from './di.container';

type CommandName = "init" | "run" | "publish" | "push" | "disable" | "enable" | "keyfile"
export type CommandHandler = (args?: any) => Promise<void>

async function executeCommand(cliCommandName: CommandName, cliArgs: any) {
  try {
    const diContainer = configureContainer({ ...cliArgs, cliCommandName });
    const command = diContainer.resolve<CommandHandler>(cliCommandName)
    await command()
  } catch (e) {
    console.error(`ERROR: ${e}`)
    process.exit()
  }
}

yargs
  .command('init', 'Initialize a Forta Agent project', 
    (yargs: Argv) => {
      yargs.option('typescript', {
        description: 'Initialize as Typescript project',
      }).option('python', {
        description: 'Initialize as Python project'
      })
    },
    (cliArgs: any) => executeCommand("init", cliArgs)
  )
  .command('run', 'Run the Forta Agent with latest blockchain data',
    (yargs: Argv) => {
      yargs.option('tx', {
        description: 'Run with the specified transaction hash',
        type: 'string'
      }).option('block', {
        description: 'Run with the specified block hash/number',
        type: 'string'
      }).option('range', {
        description: 'Run with the specified block range (e.g. 15..20)',
        type: 'string'
      }).option('file', {
        description: 'Run with the specified json file',
        type: 'string'
      }).option('prod', {
        description: 'Run a server listening for events from a Forta Scanner'
      }).option('config', {
        description: 'Specify a config file (default: forta.config.json)',
        type: 'string',
      }).option('nocache', {
        description: 'Disables writing to the cache (but reads are still enabled)',
        type: 'string'
      })
    },
    (cliArgs: any) => executeCommand("run", cliArgs)
  )
  .command('publish', 'Publish the Forta Agent to the network',
    (yargs: Argv) => {
      yargs.option('config', {
        description: 'Specify a config file (default: forta.config.json)',
        type: 'string',
      })
    },
    (cliArgs: any) => executeCommand("publish", cliArgs)
  )
  .command('push', 'Push the Forta Agent image to the repository',
    (yargs: Argv) => {
      yargs.option('config', {
        description: 'Specify a config file (default: forta.config.json)',
        type: 'string',
      })
    },
    (cliArgs: any) => executeCommand("push", cliArgs)
  )
  .command('disable', 'Disables the Forta Agent',
    (yargs: Argv) => {},
    (cliArgs: any) => executeCommand("disable", cliArgs)
  )
  .command('enable', 'Enables the Forta Agent',
    (yargs: Argv) => {},
    (cliArgs: any) => executeCommand("enable", cliArgs)
  )
  .command('keyfile', 'Prints out keyfile information',
    (yargs: Argv) => {},
    (cliArgs: any) => executeCommand("keyfile", cliArgs)
  )
  .strict()
  .argv