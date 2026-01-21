from flask import Flask, request, jsonify
from flask_cors import CORS

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


if __name__ == "__main__":
    app.run(debug=True)