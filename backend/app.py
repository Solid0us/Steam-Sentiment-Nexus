from flask import Flask, jsonify, request, Response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///database.db"

db = SQLAlchemy(app)

class SteamGames(db.Model):
    id = db.Column(db.String, primary_key = True)
    name = db.Column(db.String, nullable=False)
    isActive = db.Column(db.Boolean, default=True)

    def __init__(self, id:str, name:str, isActive=True):
        self.id = id
        self.name = name
        self.isActive = isActive

@app.route("/games", methods=["GET", "POST"])
def games():
    if request.method == "GET":
        games = SteamGames.query.all()
        game_list = []
        for game in games:
            game_list.append({
                "id": game.id,
                "name": game.name,
                "isActive": game.isActive
            })
        return jsonify({
            "status": "success",
            "games": game_list
        }), 200
    else:
        req_body = request.get_json()
        games: list[SteamGames] = []
        for game in req_body["games"]:
            games.append(SteamGames(game["id"], game["name"], game["isActive"]))
        db.session.bulk_save_objects(games)
        db.session.commit()
        return jsonify({
            "status":"success"
        }),201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run()