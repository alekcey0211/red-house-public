Scriptname StringUtilEx

String Function ToLower(String str) global native
String Function Join(String[] array, String sep = "") global native
String Function Quotes(String str) global native
String Function Match(String str, String strFind) global native

; Мержит массив строк в одну, допустим для токенов надо
String Function MergeStrings(String[] array, int skip = 0, string separator = " ") global
  int i = skip
  int ArrayLength = array.Length
  String str

  While (i < ArrayLength)
    str = str + separator + array[i]
    i += 1
  EndWhile
  Return str
EndFunction