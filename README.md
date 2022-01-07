# Drop Effects on Items

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FElfFriend-DnD%2Ffoundryvtt-drop-effects-on-items%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange)
![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2FElfFriend-DnD%2Ffoundryvtt-drop-effects-on-items%2Freleases%2Flatest)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fdrop-effects-on-items&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fdrop-effects-on-items%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/drop-effects-on-items/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fdrop-effects-on-items%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/drop-effects-on-items/)

[![ko-fi](https://img.shields.io/badge/-buy%20me%20a%20coke-%23FF5E5B)](https://ko-fi.com/elffriend)
[![patreon](https://img.shields.io/badge/-patreon-%23FF424D)](https://www.patreon.com/ElfFriend_DnD)

This module allows active effects to be dragged and dropped to and from Item Sheets.

With it enabled, creating duplicate effects between different items (e.g. "Poisoned" for various weapons or spells which inflict that condition) is as simple as dragging and dropping from one to the next.

It also allows the application of item effects onto actors from the item sheet directly.

https://user-images.githubusercontent.com/7644614/148474868-40e45f9b-042f-4241-a54d-8b878a3f72cb.mp4

## Compatibility

Tested with dnd5e, might work on other systems as well though.

Super Charged by:
- [Edit Owned Item Effects](https://github.com/ElfFriend-DnD/foundryvtt-edit-owned-item-effects)

## Technical Details

The module uses the renderItemSheet hook to bind a `DragDrop` instance with callbacks that expect/conform to the data model used by ActorSheet's ActiveEffect drag and drop handlers (`ActorSheet._onDropActiveEffect`). This consists roughly of a dataTransfer object that looks like this:

```
{
  type: "ActiveEffect",
  data: activeEffectDocumentData
}
```