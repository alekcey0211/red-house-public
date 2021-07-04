Scriptname RHF_SelectBox
{Файл для отслеживания ответов от messageBox}

; Нужно, что бы не дублировать возвращаемую команду SelectBox
; Если она будет несколько раз определяться, то читаться игрой будет только первый раз
Bool Function HandleCommand(Actor ac, String[] tokens) global
  String command = tokens[0]

  If (command == "/SelectBox")
    If tokens.Length != 2
        Return False
    EndIf

    String answer = tokens[1]
    
  ElseIf (command == "SelectBoxClose")
    M.BrowserSetModal(ac, false)
    M.BrowserSetFocused(ac, false)
    Return True
  EndIf

  Return False
EndFunction

; В textButtons передается текст кнопок, по умолчанию каждой будет присвоен порядковый номер от 0, до 4
; Если хотите отлавливать обратные значения указывайте returnValue
; Если вы укажите returnValue (размер должен быть равен tetxBtn), то будут присвоены соответствующие возвращаемые значения для textButtons
Function InitMessageBox(Actor ac, String title, String subtitle, String[] textButtons, String[] returnValue = None, Bool canClose = true) global
  ; Основные поля
  String[] keys = new String[4]
  String[] values = new String[4]
  keys[0] = "canClose"
  keys[1] = "title"
  keys[2] = "subtitle"
  keys[3] = "buttons"
  ; Вложенные в buttons
  String[] btnKeys = new String[2]
  String[] btnValue = new String[2]
  btnKeys[0] = "text"
  btnKeys[1] = "value"

  Int btnIndex = 0
  String btns = ""

  While (btnIndex < textButtons.length)
    btnValue[0] = StringUtilEx.Quotes(textButtons[btnIndex] as String)
    if (returnValue || returnValue.length == textButtons.length)
      btnValue[1] = StringUtilEx.Quotes(returnValue[btnIndex] as String)
    Else
      btnValue[1] = StringUtilEx.Quotes(btnIndex)
    EndIf
    btns += RHF_Utils.JsonObject(btnKeys, btnValue)
    btnIndex += 1
    if btnIndex != textButtons.length
      btns += ","
    EndIf
  EndWhile
  if canClose
    values[0] = "true"
  Else
    values[0] = "false"
  EndIf
  values[1] = StringUtilEx.Quotes(title)
  values[2] = StringUtilEx.Quotes(subtitle)
  values[3] = "[" + btns + "]"

  M.BrowserSetModal(ac, true)
  M.BrowserSetFocused(ac, true)

  M.SendChatCommand(ac, RHF_Front_MESSAGEBOX.selectBoxInit(), RHF_Utils.JsonObject(keys, values))
EndFunction
