# Интерфейс выбора инструмента для готовки
Здесь описаны все методы взаимодействия *frontend* и *backend* частей в контексте данного интерфейса.

## Отправка с FRONTEND

#### Отправка выбора инструмента
```
/CookingCraftSelectTool pot
```
- *pot* - Инструмент готовки (пр. *pot*, *skillet*)

## Отправка с BACKEND

#### Отправка наличия инструментов
```
UI COMMAND: COOKINGCRAFTSELECT_UPDATE_TOOLS
DATA: "{"hasPot": true, "hasSkillet": true}"
```
- *hasPot* - Наличие котелка
- *hasSkillet* - Наличие сковороды