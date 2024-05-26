# @gnome/cmd-cli

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `cmd-cli` module provides a simple way to execute
windows command line scripts or files.

The module relies upon the @gnome/exec module and
has the same basic usage as the `Command` and `ShellCommand` class.

## Basic Usage

```typescript
import { bash } from "@gnome/cmd-cli";

const cmd2 = await cmd("echo 'Hello, World!'", { 
        stdout: 'piped', 
        stderr: 'piped'
    });
console.log(await cmd2.text());
console.log(cmd2.code);

console.log(await cmd("echo 'Hello, World!'").text());

console.log(await cmd("test.cmd").text()); 

// runs bash command and writes directly to console
await cmd("echo 'I am alive'").run();
```

[MIT License](./LICENSE.md)
