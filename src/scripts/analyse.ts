import { readFileSync, writeFileSync } from 'fs'
import * as fs from 'fs';
import yargs from 'yargs'
import { analyse } from '../analysis'
import seed from '../db/seed'
import { Token } from '../types'
//import fetch from 'node-fetch';

const argv = yargs(process.argv.slice(2)).options({
  json: {
    type: 'string',
    default: 'src/data/collection.json',
    describe: 'Path to the token attribute file',
  },
  saveJson: {
    type: 'boolean',
    default: false,
    describe: 'Use this flag to save data into a json file',
  },
  db: {
    type: 'boolean',
    default: true,
    describe: 'If true, adds data to database',
  }
}).argv

if ('json' in argv) {
  console.log(argv.json)
  const myArray = argv.json.split(".", 2);
  const max = parseInt(myArray[1]);
  argv.json = myArray[0];
  console.log('Analysing data...')
  let jsondata = []
  

    for (let i = 1; i <= max; i++) {
      //fetch(argv.json+i).then(response => jsondata.push(response.json))
      console.log(i+" of " + max)
      let rawjson = JSON.parse(fs.readFileSync(argv.json+i+".json").toString())
      rawjson = { ...rawjson, id: i }
      jsondata.push(rawjson)
      //jsondata.push(JSON.parse(fs.readFileSync(argv.json+i+".json").toString()))
    }

  // for (let i = 0; i < 3; i++) {
  //   console.log ("Block statement execution no." + i);
  // }
  console.log("test")
  console.log(myArray[1])
  //forLoop(1);
  console.log(jsondata.toString())
  //const rawData = readFileSync(argv.json+".json", { encoding: 'utf-8' })
  const tokens: Token[] | { tokens: Token[] } = jsondata

  console.log(Array.isArray(tokens))
  const collection = analyse(tokens)
  

  if (argv.saveJson) {
    writeFileSync(
      'src/data/' + 'collection-rarities.json',
      JSON.stringify(collection)
    )
    console.log(`\nRarity data written in src/data/collection-rarities.json\n`)
  }

  if (argv.db) {
    console.log('\nInitializing database.')

    seed(collection).then(() => {
      console.log(`\nDatabase initialized.`)
    })
  }
}
