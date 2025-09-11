from flask import Blueprint, jsonify
import analytics

api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def home_page():
    return "Python analytics server"


@api.route("/overview", methods=["GET"])
def get_overview_data():
    try:
        return jsonify(analytics.get_overview_data())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/admins-info", methods=["GET"])
def get_administrators():
    try:
        return jsonify(analytics.get_administrators())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/signups-overview", methods=["GET"])
def get_signups_last_six_months():
    try:
        return jsonify(analytics.get_signups_last_six_months())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
