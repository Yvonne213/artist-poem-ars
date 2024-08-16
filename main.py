import asyncio
import websockets



connected = set()

async def server(websocket, path):
    # Register websocket connection
    connected.add(websocket)
    try:
        while True:
            message = await websocket.recv()
            for user in connected:
                if user != websocket:
                    await user.send(message)
    except Exception as e:  # ConnectionClosedError or RuntimeError can occur upon closing the tab/browser.
        pass
    finally:
        # Unregister websocket connection
        connected.remove(websocket)

start_server = websockets.serve(server, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


