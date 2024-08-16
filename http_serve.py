print("websocket server Server started at localhost:8765")


# Import necessary modules
import http.server
import socketserver

# Define the port on which the server will run
PORT = 8000

# Create an instance of the HTTP server
Handler = http.server.SimpleHTTPRequestHandler
http_server = socketserver.TCPServer(("0.0.0.0", PORT), Handler)

# Display a message indicating the server is running
print(f"Server started at localhost:{PORT}")

# Start the server
http_server.serve_forever()