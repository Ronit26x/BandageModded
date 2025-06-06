from flask import Flask, request, send_file, abort, jsonify
import tempfile
import os
import uuid
import subprocess

app = Flask(__name__)

# In-memory mapping of session IDs to file paths
SESSIONS = {}

@app.route('/load', methods=['POST'])
def load_graph():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    session_id = str(uuid.uuid4())
    temp_dir = tempfile.mkdtemp(prefix='bandage_')
    graph_path = os.path.join(temp_dir, file.filename)
    file.save(graph_path)

    SESSIONS[session_id] = graph_path
    return jsonify({'session': session_id})


def _get_graph(session_id):
    path = SESSIONS.get(session_id)
    if not path or not os.path.exists(path):
        abort(404)
    return path

@app.route('/image/<session_id>')
def image(session_id):
    graph_path = _get_graph(session_id)
    temp_dir = tempfile.mkdtemp(prefix='bandage_img_')
    image_path = os.path.join(temp_dir, 'graph.png')
    try:
        subprocess.run([
            'bandage', 'image', graph_path, image_path
        ], check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 500
    return send_file(image_path, mimetype='image/png')

@app.route('/info/<session_id>')
def info(session_id):
    graph_path = _get_graph(session_id)
    try:
        result = subprocess.run([
            'bandage', 'info', graph_path
        ], check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 500
    return result.stdout, 200, {'Content-Type': 'text/plain; charset=utf-8'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
