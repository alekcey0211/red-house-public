Scriptname RHF_Global
{RHF Global variables.}

Int[] Function CLOTHES() global
  Int[] items = new Int[8]
  items[0] = 0x6c1d8
  items[1] = 0x209a6
  items[2] = 0x6c1d9
  items[3] = 0x3452e
  items[4] = 0x6c1da
  items[5] = 0x261c0
  items[6] = 0x1be1a
  items[7] = 0x646a7
  Return items
EndFunction

Int[] Function SHOES() global
  Int[] items = new Int[4]
  items[0] = 0x1be1b
  items[1] = 0x261bd
  items[2] = 0x209a5
  items[3] = 0xbacd7
  Return items
EndFunction

Int[] Function HATS() global
  Int[] items = new Int[2]
  items[0] = 0x13104
  items[1] = 0x209aa
  Return items
EndFunction

Bool Function EnableDebug() global
  Return GameEx.GetServerOptionsBool("EnableDebug")
EndFunction