# Server options Reference

## serverName

Server's name. Displayed on watermark in game.

```json
{
	// ...
	"serverName": "My Server"
	// ...
}
```

## EnableDebug

A boolean setting that enables to turn on or turn off log debug info in papyrus scripts

```json
{
	// ...
	"EnableDebug": false
	// ...
}
```


## SpawnTimeToRespawn

A number setting that change time to player respawn

```json
{
	// ...
	"SpawnTimeToRespawn": 1
	// ...
}
```

## spawnTimeToRespawnNPC

A number setting that change time to npc respawn

```json
{
	// ...
	"spawnTimeToRespawnNPC": 1
	// ...
}
```

## spawnTimeById

contains string array that change time to respawn by actor id
if you set time to -1 actor don't respawn and delete from server

```json
{
	// ...
	"spawnTimeById": ["0x23a9c:-1", "0x23a99:-1"]
	// ...
}
```

## HitDamageMod

A number setting that change damage without weapon

```json
{
	// ...
	"HitDamageMod": -5
	// ...
}
```

## HitStaminaReduce

A number setting that change stamina reduce without weapon

```json
{
	// ...
	"HitStaminaReduce": 5
	// ...
}
```

## isPowerAttackMult

A number setting that change power attack multiply

```json
{
	// ...
	"isPowerAttackMult": 2
	// ...
}
```

## isBashAttackMult

A number setting that change bash attack multiply

```json
{
	// ...
	"isBashAttackMult": 0.5
	// ...
}
```

## isPowerAttackStaminaReduce

A number setting that change power attack stamina reduce

```json
{
	// ...
	"isPowerAttackStaminaReduce": 25
	// ...
}
```

## keybinding

A number setting that change default keybindings

- keybindingBrowserSetVisible - browser visible
- keybindingBrowserSetFocused - browser focused
- keybindingShowChat - show chat
- keybindingShowAnimList - show animation list
- keybindingAcceptTrade - key to accept trade
- keybindingRejectTrade - key to reject trade

```json
{
	// ...
	"keybindingBrowserSetVisible": 65,
	"keybindingBrowserSetFocused": 64,
	"keybindingShowChat": 28,
	"keybindingShowAnimList": 22,
	"keybindingAcceptTrade": 21,
	"keybindingRejectTrade": 49
	// ...
}
```

## command

A string setting that contains bind chat command to combination alt + key

```json
{
	// ...
	"command1": "/additem 0x12eb7",
	"command2": "",
	"command3": "",
	"command4": "",
	"command5": "",
	"command6": "",
	"command7": "",
	"command8": "",
	"command9": "",
	"command0": ""
	// ...
}
```

## Heal regeneration

A number setting that change heal regenaration rate, multiply and drain

```json
{
	// ...
	"AVhealrate": 0,
	"AVhealratemult": 0,
	"AVhealthdrain": 0
	// ...
}
```

## StartUpItemsAdd

Array of string that contains list of items in format id;count that add at startup

```json
{
	// ...
	"StartUpItemsAdd": ["0x12eb7;1"]
	// ...
}
```
