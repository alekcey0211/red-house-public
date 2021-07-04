Scriptname RHF_Utils
{RHF utils functions.}

; ???
String Function KeyValue(String key2, String value) global
	Return  StringUtilEx.Quotes(key2) + ": " + value
EndFunction

; ???
String Function JsonObject(String[] keys, String[] values) global
	If (keys.Length != values.Length)
		Return None
	EndIf
	int index = 0
	; Int size = keys.Length
	String[] itemsKey = Utility.CreateStringArray(0)

  While index < keys.Length
		If (values[index])
			itemsKey = UtilityEx.PushStringArray(itemsKey, KeyValue(keys[index], values[index]))
		EndIf
    index += 1
  EndWhile
	Return "{" + StringUtilEx.Join(itemsKey, ",") + "}"
EndFunction 