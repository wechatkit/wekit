import { swc, defineRollupSwcOption } from "rollup-plugin-swc3";
import { defineConfig } from "rollup";
import { Command } from "commander";
const program = new Command();
program.option("-w, --watch", "watch mode");
program.option("-c, --config <path>", "config file path");
program.option("-pn, --pack-name <name>", "package name");

program.parse(process.argv);

const opts = program.opts();

const packName = opts.packName;

const packBase = `packages/${packName}`;

export default defineConfig({
  input: `${packBase}/src/index.ts`,
  output: [
    {
      file: `${packBase}/dist/wekit-${packName}.cjs.js`,
      format: "cjs",
    },
    {
      file: `${packBase}/dist/wekit-${packName}.esm.js`,
      format: "esm",
    },
  ],
  plugins: [
    swc(
      defineRollupSwcOption({
        tsconfig: "tsconfig.json",
      })
    ),
  ],
});
