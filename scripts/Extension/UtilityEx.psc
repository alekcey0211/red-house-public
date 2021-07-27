Scriptname UtilityEx

Int Function ArrayStringFind(String[] array, String toFind) global native
Int Function ArrayIntFind(Int[] array, Int toFind) global native
Int Function ArrayFloatFind(Float[] array, Float toFind) global native

Int[] Function ArrayStringFindAll(String[] array, String toFind) global native
Int[] Function ArrayIntFindAll(Int[] array, Int toFind) global native
Int[] Function ArrayFloatFindAll(Float[] array, Float toFind) global native

Int[] Function StringArrayToIntArray(String[] array) global native
Float[] Function StringArrayToFloatArray(String[] array) global native
ObjectReference[] Function FormArrayToObjectReferenceArray(Form[] array) global native
Actor[] Function FormArrayToActorArray(Form[] array) global native

String[] Function PushStringArray(String[] array, String newValue) global native
Int[] Function PushIntArray(Int[] array, Int newValue) global native
Float[] Function PushFloatArray(Float[] array, Float newValue) global native
Form[] Function PushFormArray(Form[] array, Form newValue) global native

String[] Function UnshiftStringArray(String[] array, String newValue) global native
Int[] Function UnshiftIntArray(Int[] array, Int newValue) global native
Float[] Function UnshiftFloatArray(Float[] array, Float newValue) global native
Form[] Function UnshiftFormArray(Form[] array, Form newValue) global native

String[] Function SpliceStringArray(String[] array, Int index, Int countDeleteElements = 1) global native
Int[] Function SpliceIntArray(Int[] array, Int index, Int countDeleteElements = 1) global native
Float[] Function SpliceFloatArray(Float[] array, Int index, Int countDeleteElements = 1) global native
Form[] Function SpliceFormArray(Form[] array, Int index, Int countDeleteElements = 1) global native
