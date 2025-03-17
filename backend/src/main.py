from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

app = FastAPI()

rooms: Dict[str, List[WebSocket]] = {}
hosts: Dict[str, str] = {}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in rooms:
        rooms[room_id] = []
    rooms[room_id].append(websocket)
    print(f"User connected to room {room_id}. Current users in room: {len(rooms[room_id])}")

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)
            if data["type"] == "join":
                if room_id not in hosts:
                    hosts[room_id] = data["name"]
                    await websocket.send_text(json.dumps({"type": "host", "isHost": True}))
                    await broadcast_message(room_id, {"type": "hostName", "name": data["name"]})
                else:
                    await websocket.send_text(json.dumps({"type": "host", "isHost": False}))
                    await websocket.send_text(json.dumps({"type": "hostName", "name": hosts[room_id]}))
                await broadcast_message(room_id, {"type": "onlineCount", "count": len(rooms[room_id])})
            elif data["type"] == "startContent":
                await broadcast_message(room_id, {"type": "contentStarted"})
            
    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)
        print(f"User disconnected from room {room_id}. Current users in room: {len(rooms[room_id])}")
        if not rooms[room_id]:
            del rooms[room_id]
            del hosts[room_id]

async def broadcast_message(room_id: str, message: dict):
    for ws in rooms[room_id]:
        await ws.send_text(json.dumps(message))