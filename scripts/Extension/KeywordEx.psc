Scriptname KeywordEx extends FormEx Hidden
{}

; Возвращает keyword по имени
Keyword Function GetKeyword(string key) global native

; Возвращает Id Keyword-а, используйте, если FormId возвращает неправильное значение
Int Function GetIdKeyword(string key) global native
