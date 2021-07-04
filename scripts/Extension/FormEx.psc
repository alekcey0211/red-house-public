Scriptname FormEx
{RHF FormEx.}

; ???
String Function GetEditorID(Form form) global native
; ???
String Function GetDescription(Form form) global native
; If the default HasKeyword does not work
Bool Function HasKeyword(Int baseFormId, Int KeywordId) global native
; Return type Form
Bool Function GetSignature(Int baseFormId) global native
; Return true, if type equal to type BaseForm
Bool Function EqualSignature(Int baseFormId, String type) global native