Scriptname RHF_M
{RHF M functions.}

Function BrowserSetFocused(Actor ac, Bool focused) global
  M.BrowserSetFocused(ac, focused)
endfunction

Function BrowserSetModal(Actor ac, Bool modal) global
  M.BrowserSetModal(ac, modal)
endfunction

Function BrowserSetVisible(Actor ac, Bool visible) global
  M.BrowserSetVisible(ac, visible)
endfunction

Bool Function BrowserGetModal(Actor ac) global
  Return M.BrowserGetModal(ac)
EndFunction

Function Kill(Actor ac) global
  ac.DamageAV("health", 99999)
  ObjectReferenceEx.SetStorageValueBool(ac, "isDead", True)
  GM_Main._onDeath(ac)
EndFunction