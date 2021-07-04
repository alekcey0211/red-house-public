Scriptname GM_Trigger extends ObjectReference
{
  Чтобы события onTriggerleave и onTriggerEnter работали, необходимо повесить событие на триггер в esp
  triggerRef - Это Актер который активировал триггер
}
Event onTriggerleave(ObjectReference triggerRef)
endEvent

Event onTriggerEnter(ObjectReference triggerRef)
endEvent