#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net=mentai-mayo.github.io

import * as CSV from "jsr:@std/csv";

declare namespace Deno {
  /**
   * Returns the script arguments to the program.  
   * Give the following command line invocation of Deno:
   * ```sh
   * deno run --allow-read https://examples.deno.land/command-line-arguments.ts Sushi
   * ```
   * Then `Deno.args` will contain:
   * ```ts
   * [ "Sushi" ]
   * ```
   * If you are looking for a structured way to parse arguments, there is
   * [`parseArgs()`](https://jsr.io/@std/cli/doc/parse-args/~/parseArgs)
   * from the Deno Standard Library.
   */
  const args: string[];

  /**
   * Synchronously reads and returns the entire contents of a file as an UTF-8 decoded string.
   * Reading a directory throws an error.
   * ```ts
   * const data = Deno.readTextFileSync("hello.txt");
   * console.log(data);
   * ```
   * Requires `allow-read` permission.
   */
  function readTextFileSync(path: string | URL): string;

  /**
   * Synchronously write string `data` to the given `path`, by default creating a new file if needed, else overwriting.
   * ```ts
   * Deno.writeTextFileSync("hello1.txt", "Hello world\n");  // overwrite "hello1.txt" or create it
   * ```
   * Requires `allow-write` permission, and `allow-read` if `options.create` is `false`.
   */
  function writeTextFileSync(path: string | URL, data: string, options?: WriteFileOptions): void;

  /** Options for writing to a file. */
  interface WriteFileOptions {
    /**
     * If set to `true`, will append to a file instead of overwriting previous contents.  
     * Default: `false`
     */
    append?: boolean;
    /**
     * Sets the option to allow creating a new file, if one doesn't already exist at the specified path.
     * Default: `true`
     */
    create?: boolean;
    /**
     * If set to `true`, no file, directory, or symlink is allowed to exist at the target location. When createNew is set to `true`, `create` is ignored.
     * Default: `false`
     */
    createNew?: boolean;
    /**
     * Permissions always applied to file.
     */
    mode?: number;
    /**
     * An abort signal to allow cancellation of the file write operation.  
     * If the signal becomes aborted the write file operation will be stopped and the promise returned will be rejected with an `AbortError`.
     */
    signal?: AbortSignal;
  }
}

interface Ship {
  id: number;
  chars: string;
  name: string;
  type: string;
  class: string;
}

// ----- script main code -----

// CLI arguments
if (Deno.args.length != 1) {
  throw "only 1 args required";
}

/** csv filepath */
const csv_filepath: string = Deno.args[0];

// load csv file
const csv_text: string = Deno.readTextFileSync(csv_filepath);

// parse csv file
const data: string[][] = CSV.parse(csv_text);

// remove key line
data.shift();

// create Ship datas
let ships: Ship[] = data.map(ship => {
  const data: Ship = Object.create(null);
  data.id = +ship[0];   // 艦船ID
  data.chars = ship[5]; // 読み
  data.name = ship[4];  // 艦名
  data.type = ship[3];  // 艦種
  data.class = ship[2]; // 艦型
  switch (data.chars) {
  case "": case "-": case "elite": case "flagship":
    return void 0
  default:
    return data;
  }
}).filter(v => v !== void 0);

// chars map
const charsmap: { [key: string]: Ship } = ships.reduce((map, ship) => {
  if (!map[ship.chars] || ship.name.length < map[ship.chars].name.length) {
    map[ship.chars] = ship;
  }
  return map;
}, Object.create(null) as { [key: string]: Ship });
const ship_ids = Object.entries(charsmap).map(([_, v]) => v.id);

// regenerate ships (without duplicated chars)
ships = ships.filter(ship => ship_ids.includes(ship.id));

// change hiragana -> katakana in ship.chars
ships = ships.map(ship => {
  ship.chars = ship.chars.replace(/[\u3041-\u3096]/g, match => String.fromCharCode(match.charCodeAt(0) + 0x60));
  return ship;
});

// get remote
const remote: Ship[] = await fetch("https://mentai-mayo.github.io/kancolle-wordle/ships.json").then(v => v.json());
const remote_ids: number[] = remote.map(v => v.id);

// get diff
const diff: Ship[] = ships.reduce((array: Ship[], value: Ship): Ship[] => {
  if (!remote_ids.includes(value.id)) {
    array.push(value);
  }
  return array;
}, []);

// show diff
console.table(diff);

// output
Deno.writeTextFileSync("out.json", JSON.stringify(diff, void 0, 2));
