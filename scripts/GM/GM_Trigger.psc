Scriptname GM_Trigger extends ObjectReference
{
  Чтобы события onTriggerleave и onTriggerEnter работали, необходимо повесить событие на триггер в esp
  triggerRef - Это Актер который активировал триггер
}
Event onTriggerleave(ObjectReference triggerRef)
  RHF_Main.onTriggerleave(triggerRef, self.GetFormID())
endEvent

Event onTriggerEnter(ObjectReference triggerRef)
  RHF_Main.onTriggerEnter(triggerRef, self.GetFormID())
endEvent