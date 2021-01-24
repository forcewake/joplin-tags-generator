# Joplin Generate Tags Plugin

Plugin for Joplin which can be used to extract keywords from note and assign them as a note's tags.

# Demo
![Demo](img/demo.gif)

## Installation

### Automatic

- Go to `Tools > Options > Plugins`
- Search for `Tags Generator`
- Click Install plugin
- Restart Joplin to enable the plugin

### Manual

- Download the latest released JPL package (`joplin.plugin.forcewake.tags-generator.jpl`) from [here](https://github.com/forcewake/joplin-tags-generator/releases/latest)
- Close Joplin
- Copy the downloaded JPL package in your profile `plugins` folder
- Start Joplin

## Commands

- `Generate tags`

### Generate tags

Uses several awesome [unified](https://github.com/unifiedjs) packages in order to process, analyse and extract keywords from *english-based markdown* only notes.

- Select one note (markdown and written in English)
- Click on `Tools > Generate tags...` or use the command `Generate tags...` from the context menu or use the Command palette and find the command `Generate tags...`.

## Keyboard Shortcuts

Under `Options > Keyboard Shortcus` you can assign a keyboard shortcut for `Generate tags...` command.

## Build

To build your one version of the plugin, install node.js and run the following command `npm run dist`

## Updating the plugin framework

To update the plugin framework, run `npm run update`

## Links

- [Joplin - Getting started with plugin development](https://joplinapp.org/api/get_started/plugins/)
- [Joplin - Plugin API reference](https://joplinapp.org/api/references/plugin_api/classes/joplin.html)
- [Joplin - Data API reference](https://joplinapp.org/api/references/rest_api/)
- [Joplin - Plugin examples](https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins)
