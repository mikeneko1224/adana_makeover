from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import asyncio

app = FastAPI()

rooms: Dict[str, List[WebSocket]] = {}
hosts: Dict[str, str] = {}
nicknames: Dict[str, List[str]] = {}
nameCounts: Dict[str, int] = {}
votes: Dict[str, Dict[str, int]] = {}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in rooms:
        rooms[room_id] = []
    if room_id not in nicknames:
        nicknames[room_id] = []
    if room_id not in nameCounts:
        nameCounts[room_id] = 0
    if room_id not in votes:
        votes[room_id] = {}
    rooms[room_id].append(websocket)
    print(f"User connected to room {room_id}. Current users in room: {len(rooms[room_id])}")

    try:
        while True:
            message = await websocket.receive_text()
            #dataにフロントから受け取ったjson入れた
            data = json.loads(message)
            print(f"Received message: {data}")

            if "name" in data:
                print(f"{data["name"]} join room")

# websocket.send_textはフロントにデータを送る
# if data["type"] == "join":はフロントからのデータがjoinだった場合でHostを判断
# json.dumpsはpythonのdictをjsonに変換する

            if data["type"] == "join":
                if room_id not in hosts:
                    hosts[room_id] = data["name"]
                    await websocket.send_text(json.dumps({"type": "host", "isHost": True}))
                    await broadcast_message(room_id, {"type": "hostName", "name": hosts[room_id]})
                else:
                    await websocket.send_text(json.dumps({"type": "host", "isHost": False}))
                    await websocket.send_text(json.dumps({"type": "hostName", "name": hosts[room_id]}))
                await broadcast_message(room_id, {"type": "onlineCount", "count": len(rooms[room_id])})
            elif data["type"] == "startContent":
                await broadcast_message(room_id, {"type": "contentStarted"})
            elif data["type"] == "gameStage":
                if data["gameStage"] == "gameStart":
                    print(f"Broadcasting gameStage: waitingImage to room {room_id}")
                    await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingImage"})
                elif data["gameStage"] == "sendImage":
                    await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingQuestion"})
                elif data["gameStage"] == "sendQuestion":
                    await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingAnswer"})
                elif data["gameStage"] == "sendAnswer":
                    await broadcast_message(room_id, {"type": "gameStage", "gameStage": "thinkingName"})
                elif data["gameStage"] == "sendName":
                    nameCounts[room_id] += 1
                    print(f"送信済みの人数: {nameCounts[room_id]}")
                    if nameCounts[room_id] == len(rooms[room_id]):
                        await broadcast_message(room_id, {"type": "gameStage", "nicknames": nicknames[room_id]})
                        await broadcast_message(room_id, {"type": "gameStage", "gameStage": "choosingName"})
                        nameCounts[room_id] = 0
                elif data["gameStage"] == "choseName" or data["gameStage"] == "badName":
                    if data["gameStage"] == "choseName":
                        goodCount += 1
                        print(f"今の合計{goodCount+badCount}")
                    else:
                        badCount += 1
                        print(f"今の合計{goodCount+badCount}部屋には{len(rooms[room_id])}人いる")
                    if goodCount + badCount == len(rooms[room_id]):
                        if goodCount <= badCount:
                            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "showResult"})
                            await asyncio.sleep(8)
                            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingQuestion"})
                            goodCount = 0
                            badCount = 0
                        else:
                            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "showResult"})
                            await asyncio.sleep(8)
                            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "gameOver"})
                            goodCount = 0
                            badCount = 0
            elif data["type"] == "image":
                await broadcast_message(room_id, {"type": "image", "image": data["image"]})
            elif data["type"] == "nickname":
                nicknames[room_id].append(data["nickname"])
                await broadcast_message(room_id, {"type": "nickname", "nickname": data["nickname"]})
                print (f"nicknames: {nicknames[room_id]}")
            
    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)
        await broadcast_message(room_id, {"type": "onlineCount", "count": len(rooms[room_id])})
        print(f"User disconnected from room {room_id}. Current users in room: {len(rooms[room_id])}")
        if not rooms[room_id]:
            del rooms[room_id]
            del hosts[room_id]
            del nicknames[room_id]
            del nameCounts[room_id]
            del votes[room_id]

# ルーム内の全ユーザーにメッセージを送信してる関数だよん
async def broadcast_message(room_id: str, message: dict):
    for ws in rooms[room_id]:
        await ws.send_text(json.dumps(message))