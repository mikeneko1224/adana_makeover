from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

app = FastAPI()

rooms: Dict[str, List[WebSocket]] = {}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in rooms:
        rooms[room_id] = []
    rooms[room_id].append(websocket)
    print(f"User connected to room {room_id}. Current users in room: {len(rooms[room_id])}")

    try:
        while True:
            # 待機
            message = await websocket.receive_text()
            print(f"Received message: {message}")
            
            # オンライン人数を全てのクライアントに送信
            online_count = len(rooms[room_id])
            for ws in rooms[room_id]:
                await ws.send_text(f"オンライン人数: {online_count}")
                await ws.send_text(f"Room {room_id} message: {message}")
            print(f"Sent message: オンライン人数: {online_count}")

    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)
        print(f"User disconnected from room {room_id}. Current users in room: {len(rooms[room_id])}")
        if not rooms[room_id]:
            del rooms[room_id]