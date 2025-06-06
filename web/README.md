# Bandage Web API

This directory contains a simple Flask server exposing parts of the
Bandage command line interface over HTTP.

## Requirements

- Python 3
- [Flask](https://flask.palletsprojects.com/)
- The `bandage` executable available in your `PATH`

## Usage

Start the server from this directory:

```bash
python server.py
```

The server listens on port `5000` by default.

### `POST /load`
Upload a graph file. Returns a JSON object with a session identifier.

```bash
curl -F file=@your_graph.gfa http://localhost:5000/load
```

Response example:

```json
{"session": "<id>"}
```

### `GET /image/<session>`
Generate an image of the loaded graph using `bandage image`. The
endpoint returns the generated PNG file.

```bash
curl -o graph.png http://localhost:5000/image/<id>
```

### `GET /info/<session>`
Return statistics for the graph using `bandage info`.

```bash
curl http://localhost:5000/info/<id>
```

The response is plain text containing the output of `bandage info`.
