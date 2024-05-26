import { assertEquals as equals } from "jsr:@std/assert@^0.224.0";
import { remove, writeTextFile } from "jsr:@gnome/fs@^0.0.0/deno";
import { cmd } from "./cmd.ts";
import { WINDOWS } from "@gnome/os-constants";

Deno.test({
    name: "simple inline test",
    ignore: !WINDOWS,
    fn: async () => {
        const cmd1 = await cmd("echo 'Hello, World!'");
        equals(cmd1.text(), "Hello, World!\r\n");
        equals(0, cmd1.code);
    },
});

Deno.test({
    name: "simple inline test with options",
    ignore: !WINDOWS,
    fn: async () => {
        const cmd1 = await cmd("echo 'Hello, World!'").run();
        equals(0, cmd1.code);
    },
});

Deno.test({
    name: "multi-line inline test",
    ignore: !WINDOWS,
    fn: async () => {
        const cmd1 = await cmd(`
            set a=1
            echo '%a%'
        `);
        equals(cmd1.text(), "1\r\n");
        equals(0, cmd1.code);
    },
});

Deno.test({
    name: "simple file test",
    ignore: !WINDOWS,
    fn: async () => {
        await writeTextFile("test.cmd", `
        set echo off
        echo 'Hello, World!'`);
        try {
            // purposely add space after test.ps1
            const cmd1 = await cmd("test.cmd ");
            equals(0, cmd1.code);
            equals(cmd1.text(), "Hello, World!\r\n");
        } finally {
            await remove("test.cmd");
        }
    },
});
