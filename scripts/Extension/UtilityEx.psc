Scriptname UtilityEx

Int Function ArrayStringFind(String[] array, String toFind) global native
Int Function ArrayIntFind(Int[] array, Int toFind) global native
Int Function ArrayFloatFind(Float[] array, Float toFind) global native

Int[] Function StringArrayToIntArray(String[] array) global native
Float[] Function StringArrayToFloatArray(String[] array) global native

String[] Function PushStringArray(String[] array, String newValue) global native
Int[] Function PushIntArray(Int[] array, Int newValue) global native
Float[] Function PushFloatArray(Float[] array, Float newValue) global native

String[] Function UnshiftStringArray(String[] array, String newValue) global native
Int[] Function UnshiftIntArray(Int[] array, Int newValue) global native
Float[] Function UnshiftFloatArray(Float[] array, Float newValue) global native
