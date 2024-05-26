import { ShellCommand, type ShellCommandOptions } from "@gnome/exec";
import { pathFinder } from "@gnome/exec/path-finder";
import { WINDOWS } from "@gnome/os-constants";
import { makeTempFileSync, writeTextFileSync } from "@gnome/fs";
import { isAbsolute, resolve } from "@std/path";

pathFinder.set("cmd", {
    name: "cmd",
    windows: [
        "${SystemRoot}\\System32\\cmd.exe",
    ],
});

/**
 * File extension for cmd scripts.
 */
export const CMD_EXT = ".cmd";

/**
 * Represents a  windows cmd cli command executed using the `cmd` executable.
 */
export class CmdCliCommand extends ShellCommand {
    /**
     * Creates a new instance of the `cmdCommand` class.
     * @param script The cmd script to execute.
     * @param options The options for the cmdell command.
     */
    constructor(script: string, options?: ShellCommandOptions) {
        super("cmd", script.trimEnd(), options);
    }

    static wslCheck = WINDOWS;

    /**
     * Gets the file extension associated with cmd scripts.
     */
    get ext(): string {
        return CMD_EXT;
    }

    /**
     * Retrieves the script file and indicates whether it was generated or not.
     * @returns An object containing the file path and a flag indicating if the file was generated.
     */
    getScriptFile(): { file: string | undefined; generated: boolean } {
        let script = this.script.trimEnd();

        if (script.match(/\n/) || !["cmd", "bat"].some((ext) => script.endsWith(`.${ext}`))) {
            script = `
@echo off
${script}
            `;

            const file = makeTempFileSync({
                prefix: "cmd",
                suffix: this.ext,
            });

            writeTextFileSync(file, script);
            return { file, generated: true };
        }

        script = script.trimStart();
        if (!isAbsolute(script)) {
            script = resolve(script);
        }

        return { file: script, generated: false };
    }

    /**
     * Gets the cmd arguments for executing the cmd script.
     * @param script The cmd script to execute.
     * @param isFile Specifies whether the script is a file or a command.
     * @returns The cmd arguments for executing the script.
     */
    // deno-lint-ignore no-unused-vars
    getShellArgs(script: string, isFile: boolean): string[] {
        const params = this.shellArgs ?? ["/D", "/E:ON", "/V:OFF", "/S", "/C"];

        params.push(`CALL`, script);

        return params;
    }
}

/**
 * Executes a windows command line (.cmd, .bat) script using the CmdCliCommand class.
 *
 * @param script - The cmd script to execute.
 * @param options - Optional options for the cmd command.
 * @returns A new instance of the CmdCliCommand class.
 */
export function cmd(script: string, options?: ShellCommandOptions): CmdCliCommand {
    return new CmdCliCommand(script, options);
}
