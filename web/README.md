# Web Graph Viewer

This simple frontend displays graph data served by `server.py` using D3.js.

## Running

1. Start the server from the repository root:

   ```bash
   python server.py
   ```

   The server should expose an endpoint at `/graph` that returns JSON with
   `nodes` and `links` arrays compatible with D3's force layout.

2. In another terminal, serve the `web` directory (any static file server will
   work). For example using Python:

   ```bash
   cd web
   python -m http.server 8000
   ```

3. Open your browser to [http://localhost:8000](http://localhost:8000). The page
   will fetch the graph data from `server.py` running on its default port and
   render an interactive visualization supporting zoom, pan and
   highlighting of nodes and edges on hover.
