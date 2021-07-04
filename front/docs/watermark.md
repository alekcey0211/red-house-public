# Интерфейс Вотермарка
Здесь описаны все методы взаимодействия *frontend* и *backend* частей в контексте данного интерфейса.

## Отправка с BACKEND

#### Отправка ID игрока
```
UI COMMAND: WATERMARK_UPDATE_PLAYER_ID
DATA: "{"playerID": 232}"
```
- *playerID* - ID игрока

#### Отправка количества игроков онлайн
```
UI COMMAND: WATERMARK_UPDATE_PLAYERS_ONLINE
DATA: "{"playersOnline": 24}"
```
- *playersOnline* - Количество игроков онлайн