from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_file
import tempfile
import os

from backend.src.transpiler import Transpiler
from backend.src.exceptions import TranspilerError

app = Flask(__name__)
CORS(app)  # чтобы фронт мог обращаться к API

transpiler = Transpiler()


@app.route("/transpile", methods=["POST"])
def transpile_code():
    data = request.get_json()

    if not data or "code" not in data:
        return jsonify({"error": "No code provided"}), 400

    python_code = data["code"]

    try:
        js_code = transpiler.transpile(python_code)
        return jsonify({"result": js_code})
    except TranspilerError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500

@app.route("/transpile-file", methods=["POST"])
def transpile_file():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".py"):
        return jsonify({"error": "Only .py files are supported"}), 400

    try:
        python_code = file.read().decode("utf-8")
        js_code = transpiler.transpile(python_code)

        # создаём временный js-файл
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".js", mode="w", encoding="utf-8")
        tmp.write(js_code)
        tmp.close()

        return send_file(
            tmp.name,
            as_attachment=True,
            download_name=file.filename.replace(".py", ".js")
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)