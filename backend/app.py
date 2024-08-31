from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_migrate import Migrate
app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///database.db"

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class SteamGames(db.Model):
    __tablename__ = 'steam_games'
    id = db.Column(db.String, primary_key = True)
    name = db.Column(db.String, nullable=False)
    isActive = db.Column(db.Boolean, default=True)
    reviews = db.relationship("SteamReviews")

    def __init__(self, id:str, name:str, isActive=True):
        self.id = id
        self.name = name
        self.isActive = isActive

class SteamReviews(db.Model):
    __tablename__ = "steam_reviews"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_id = db.Column(db.String, db.ForeignKey('steam_games.id'), nullable=False)
    steam_positives = db.Column(db.Integer, nullable=True)
    steam_negatives = db.Column(db.Integer, nullable=True)
    steam_review_description = db.Column(db.String, nullable=True)
    roberta_pos_avg = db.Column(db.Float, nullable=True)
    roberta_neu_avg = db.Column(db.Float, nullable=True)
    roberta_neg_avg = db.Column(db.Float, nullable=True)
    avg_hours_played_pos = db.Column(db.Float, nullable=True)
    avg_hours_played_neu = db.Column(db.Float, nullable=True)
    avg_hours_played_neg = db.Column(db.Float, nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.now())
    end_date = db.Column(db.DateTime, nullable=True)
    success = db.Column(db.Boolean, default=False)
    scraper_session_id = db.Column(db.Integer, db.ForeignKey("review_scraper_sessions.id"), nullable=False)
    number_scraped = db.Column(db.Integer, default=0)

    def __init__(self, game_id:str, 
                scraper_session_id: int,
                steam_positives:int = None, steam_negatives:int = None, 
                steam_review_description:str = None,
                roberta_pos_avg: float = None,
                roberta_neu_avg: float = None,
                roberta_neg_avg: float = None,
                avg_hours_played_pos: float = None,
                avg_hours_played_neu: float = None,
                avg_hours_played_neg: float = None,
                end_date: datetime = None
                ):
        self.game_id = game_id
        self.steam_positives = steam_positives
        self.steam_negatives = steam_negatives
        self.steam_review_description = steam_review_description
        self.roberta_pos_avg = roberta_pos_avg
        self.roberta_neu_avg = roberta_neu_avg
        self.roberta_neg_avg = roberta_neg_avg
        self.avg_hours_played_pos = avg_hours_played_pos
        self.avg_hours_played_neu = avg_hours_played_neu
        self.avg_hours_played_neg = avg_hours_played_neg
        self.created_date = datetime.now()
        self.scraper_session_id = scraper_session_id
        self.end_date = end_date

class ReviewScraperSessions(db.Model):
    __tablename__ = "review_scraper_sessions"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    start_date = db.Column(db.DateTime, default=datetime.now())
    end_date = db.Column(db.DateTime, nullable=True)
    success = db.Column(db.Boolean, default=False)
    debug_message = db.Column(db.String, nullable=True)
    reviews = db.relationship("SteamReviews")

@app.route("/api/v1/games", methods=["GET", "POST"])
def games():
    if request.method == "GET":
        games = db.session.query(SteamGames)
        game_list = []
        for game in games:
            game_list.append({
                "id": game.id,
                "name": game.name,
                "isActive": game.isActive
            })
        return jsonify({
            "status": "success",
            "data": game_list
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
    
@app.route("/api/v1/reviews", methods=["GET", "POST"])
def reviews():
    if request.method == "GET":
        review_games: list[tuple[SteamReviews, SteamGames]] = db.session.query(SteamReviews, SteamGames).join(SteamGames).all()
        review_list = []
        for review, game in review_games:
            review_list.append({
                "id": review.id,
                "steamPositives": review.steam_positives,
                "steamNegatives": review.steam_negatives,
                "steamReviewDescription": review.steam_review_description,
                "robertaPosAvg": review.roberta_pos_avg,
                "robertaNeuAvg": review.roberta_neu_avg,
                "robertaNegAvg": review.roberta_neg_avg,
                "avgHoursPlayedPos": review.avg_hours_played_pos,
                "avgHoursPlayedNeu": review.avg_hours_played_neu,
                "avgHoursPlayedNeg": review.avg_hours_played_neg,
                "game": {
                    "id": game.id,
                    "name": game.name
                }
            })
        return jsonify({
        "status": "success",
        "data": review_list
        }), 200
    else:
        req_body = request.get_json()
        try:
            game_id = req_body["gameId"]
            scraper_session_id = req_body["scraperSessionId"]
            review_to_add = SteamReviews(game_id=game_id, scraper_session_id=scraper_session_id)
            db.session.add(review_to_add)
            db.session.commit()
        except Exception as e:
            print(e)
            return jsonify({"status": "failure"}), 400
        return jsonify({
            "status":"success",
            "data": {
                "id": review_to_add.id
            }
        }),201
    
@app.route("/api/v1/reviews/<int:id>", methods=["PATCH"])
def review(id:int):
    req_body = request.get_json()
    review_to_update:SteamReviews = SteamReviews.query.filter_by(id=id).first()
    if request.method == "PATCH":
        if review_to_update != None:
            if "success" in req_body:
                review_to_update.success = req_body["success"] 
            if "steamPositives" in req_body:
                review_to_update.steam_positives = req_body["steamPositives"]
            if "steamNegatives" in req_body:
                review_to_update.steam_negatives = req_body["steamNegatives"] 
            if "steamReviewDescription" in req_body:
                review_to_update.steam_review_description = req_body["steamReviewDescription"]  
            if "robertaPosAvg" in req_body:
                review_to_update.roberta_pos_avg = req_body["robertaPosAvg"] 
            if "robertaNeuAvg" in req_body:
                review_to_update.roberta_neu_avg = req_body["robertaNeuAvg"]
            if "robertaNegAvg" in req_body:
                review_to_update.roberta_neg_avg = req_body["robertaNegAvg"] 
            if "avgHoursPlayedPos" in req_body:
                review_to_update.avg_hours_played_pos = req_body["avgHoursPlayedPos"] 
            if "avgHoursPlayedNeu" in req_body:
                review_to_update.avg_hours_played_neu = req_body["avgHoursPlayedNeu"]
            if "avgHoursPlayedNeg" in req_body:
                review_to_update.avg_hours_played_neg = req_body["avgHoursPlayedNeg"]
            if "endDate" in req_body:
                review_to_update.end_date = datetime.now()
            if "numberScraped" in req_body:
                review_to_update.number_scraped = req_body["numberScraped"]
            print(f"Updating review: {review_to_update.id, review_to_update.end_date}")
            db.session.commit()
        return jsonify({
            "status": "success"
        })

@app.route("/api/v1/review-session-scrapers", methods=["GET", "POST"])
def review_scrapers():
    if request.method == "GET":
        review_sessions: list[ReviewScraperSessions] = db.session.query(ReviewScraperSessions).all()
        review_sessions_list = []
        for session in review_sessions:
            review_sessions_list.append({
                "id": session.id,
                "startDate": session.start_date.isoformat(),
                "success": session.success,
                "endDate": session.end_date.isoformat() if session.end_date is not None else session.end_date
            })
        return jsonify({
            "status": "success",
            "reviewScrapers": review_sessions_list
        })
    elif request.method == "POST":
        new_session = ReviewScraperSessions()
        db.session.add(new_session)
        db.session.commit()
        return jsonify({
             "status": "success",
             "data": {
                 "id": new_session.id
             }
        }), 201
@app.route("/api/v1/review-session-scrapers/<int:id>", methods=["PATCH"])
def review_scraper(id:int):
    req_body = request.get_json()
    review_scraper_to_update:ReviewScraperSessions = ReviewScraperSessions.query.filter_by(id=id).first()
    if request.method == "PATCH":
        if review_scraper_to_update != None:
            if "success" in req_body:
                review_scraper_to_update.success = req_body["success"]
            if "endDate" in req_body:
                review_scraper_to_update.end_date = datetime.fromisoformat(req_body["endDate"])
            if "debugMessage" in req_body:
                review_scraper_to_update.debug_message = req_body["debugMessage"]
            
            db.session.commit()
        return jsonify({
            "status": "success"
        })
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)