FOR %%A IN (russian english french german italian japanese polish spanish) DO (
  StringsUnpacker "Skyrim - Patch/strings/dawnguard_%%A.strings" 		"../server/data/strings/dawnguard_%%A.csv"
  StringsUnpacker "Skyrim - Patch/strings/dragonborn_%%A.strings" 	"../server/data/strings/dragonborn_%%A.csv"
  StringsUnpacker "Skyrim - Patch/strings/hearthfires_%%A.strings" 	"../server/data/strings/hearthfires_%%A.csv"
  StringsUnpacker "Skyrim - Patch/strings/skyrim_%%A.strings" 		"../server/data/strings/skyrim_%%A.csv"
  StringsUnpacker "Skyrim - Patch/strings/update_%%A.strings" 		"../server/data/strings/update_%%A.csv"
)