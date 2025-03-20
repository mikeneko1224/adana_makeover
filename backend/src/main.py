from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import asyncio

app = FastAPI()

# グローバル変数
rooms: Dict[str, List[WebSocket]] = {}
hosts: Dict[str, str] = {}
nicknames: Dict[str, List[str]] = {}
questions: Dict[str, List[str]] = {}
questionsCount: Dict[str, int] = {}
answer: Dict[str, str] = {}
nameCounts: Dict[str, int] = {}
votes: Dict[str, Dict[str, int]] = {}
badCount: Dict[str, int] = {}

# ルームの初期化
def initialize_room(room_id: str):
    if room_id not in rooms:
        rooms[room_id] = []
    if room_id not in nicknames:
        nicknames[room_id] = []
    if room_id not in nameCounts:
        nameCounts[room_id] = 0
    if room_id not in votes:
        votes[room_id] = {}
    if room_id not in badCount:
        badCount[room_id] = 0
    if room_id not in questions:
        questions[room_id] = []
    if room_id not in questionsCount:
        questionsCount[room_id] = 0
    if room_id not in answer:
        answer[room_id] = ""

# メッセージの処理
async def handle_message(data: dict, websocket: WebSocket, room_id: str):
    if data["type"] == "join":
        await handle_join(data, websocket, room_id)
    elif data["type"] == "startContent":
        await broadcast_message(room_id, {"type": "contentStarted"})
    elif data["type"] == "gameStage":
        await handle_game_stage(data, room_id)
    elif data["type"] == "image":
        await broadcast_message(room_id, {"type": "image", "image": data["image"]})
    elif data["type"] == "nickname":
        await handle_nickname(data, room_id)

# "join"メッセージの処理
async def handle_join(data: dict, websocket: WebSocket, room_id: str):
    if room_id not in hosts:
        hosts[room_id] = data["name"]
        await websocket.send_text(json.dumps({"type": "host", "isHost": True}))
        await broadcast_message(room_id, {"type": "hostName", "name": hosts[room_id]})
    else:
        await websocket.send_text(json.dumps({"type": "host", "isHost": False}))
        await websocket.send_text(json.dumps({"type": "hostName", "name": hosts[room_id]}))
    await broadcast_message(room_id, {"type": "onlineCount", "count": len(rooms[room_id])})

# "gameStage"メッセージの処理
async def handle_game_stage(data: dict, room_id: str):
    if data["gameStage"] == "gameStart":
        await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingImage"})
    elif data["gameStage"] == "sendImage":
        await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingQuestion"})
    elif data["gameStage"] == "sendQuestion":
        questions[room_id].append(data["question"])
        questionsCount[room_id] += 1
        if questionsCount[room_id] == len(rooms[room_id]) - 1:
            await broadcast_message(room_id, {"type": "questions", "questions": questions[room_id]})
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingAnswer"})
            questionsCount[room_id] = 0
    elif data["gameStage"] == "sendAnswer":
        answer[room_id] = data["answer"]
        await broadcast_message(room_id, {"type": "keyword", "keyword": answer[room_id]})
        await broadcast_message(room_id, {"type": "gameStage", "gameStage": "thinkingName"})
    elif data["gameStage"] == "sendName":
        nameCounts[room_id] += 1
        if nameCounts[room_id] == len(rooms[room_id]):
            votes[room_id] = {nickname: 0 for nickname in nicknames[room_id]}
            await broadcast_message(room_id, {"type": "nicknames", "nicknames": nicknames[room_id]})
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "choosingName"})
            nameCounts[room_id] = 0
    elif data["gameStage"] in ["choseName", "badName"]:
        await handle_vote(data, room_id)

# 投票処理
async def handle_vote(data: dict, room_id: str):
    if "choseName" in data:
        votes[room_id][data["choseName"]] = votes[room_id].get(data["choseName"], 0) + 1
    else:
        badCount[room_id] += 1
    if sum(votes[room_id].values()) + badCount[room_id] == len(rooms[room_id]):
        if sum(votes[room_id].values()) <= badCount[room_id]:
            await broadcast_message(room_id, {"type": "result", "result": votes[room_id], "badCount": badCount[room_id]})
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "showResult"})
            await asyncio.sleep(8)
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "waitingQuestion"})
            badCount[room_id] = 0
            votes[room_id] = {}
        else:
            await broadcast_message(room_id, {"type": "votes", "votes": votes[room_id], "badCount": badCount[room_id]})
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "showResult"})
            await asyncio.sleep(8)
            await broadcast_message(room_id, {"type": "gameStage", "gameStage": "gameOver"})
            badCount[room_id] = 0

# "nickname"メッセージの処理
async def handle_nickname(data: dict, room_id: str):
    nicknames[room_id].append(data["nickname"])
    nicknames[room_id] = list(set(nicknames[room_id]))
    await broadcast_message(room_id, {"type": "nickname", "nickname": data["nickname"]})

# 全ユーザーにメッセージを送信
async def broadcast_message(room_id: str, message: dict):
    for ws in rooms[room_id]:
        await ws.send_text(json.dumps(message))

# WebSocketエンドポイント
@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    initialize_room(room_id)
    rooms[room_id].append(websocket)
    print(f"User connected to room {room_id}. Current users in room: {len(rooms[room_id])}")

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)
            print(f"Received message: {data}")
            await handle_message(data, websocket, room_id)
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
            del badCount[room_id]
            del questions[room_id]
            del questionsCount[room_id]