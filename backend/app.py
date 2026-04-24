from flask import Flask, request, send_file
from flask_cors import CORS
import io
import csv
from reportlab.platypus import SimpleDocTemplate, Table
from reportlab.lib import colors

app = Flask(__name__)
CORS(app)


# ✅ Health Check Route
@app.route("/api/health")
def health():
    return {"status": "ok"}


# ✅ Convert CSV to PDF Route
@app.route("/api/convert", methods=["POST"])
def convert():
    try:
        if "file" not in request.files:
            return {"error": "No file uploaded"}, 400

        file = request.files["file"]

        if file.filename == "":
            return {"error": "Empty filename"}, 400

        # Read and parse CSV safely
        content = file.read().decode("utf-8", errors="ignore")
        lines = content.splitlines()
        reader = csv.reader(lines)
        data = list(reader)

        if not data:
            return {"error": "CSV is empty"}, 400

        # Create PDF in memory
        buffer = io.BytesIO()
        pdf = SimpleDocTemplate(buffer)
        table = Table(data)

        table.setStyle([
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        pdf.build([table])
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name="converted.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        print("ERROR IN CONVERT:", str(e))
        return {"error": str(e)}, 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)