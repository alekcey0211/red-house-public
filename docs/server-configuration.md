## Server configuration

## stringsPath

Contains relative path to a directory with localization data from esp files.

```json
{
  // ...
  "stringsPath": "strings"
  // ...
}
```

## startPoints

Start points to first respawn in server

```json
{
  // ...
  "startPoints": [
		{
			"pos": [22106.24609375, -44752.68359375, -140.59170532226562],
			"worldOrCell": "0x3c",
			"angleZ": 47
		}
	]
  // ...
}
```

## isServerOptionsHotReloadEnabled

A boolean setting that enables to turn on or turn off hot reload server-options from data dir

```json
{
  // ...
  "isServerOptionsHotReloadEnabled": true
  // ...
}
```