import requests
from datetime import datetime, timezone
FLASK_API_BASE_URL = "http://localhost:5000/api/v1/"

class ScraperService():
   def create_review_scraping_session(self):
    scraper_api_response = requests.post(f"{FLASK_API_BASE_URL}review-session-scrapers", data={},  headers={
        "Content-Type": "application/json"
    })
    review_session_id: int = scraper_api_response.json()["data"]["id"]
    return review_session_id

   def update_review(self, reviewId: str, reviewSummaryData):
      requests.patch(f"{FLASK_API_BASE_URL}reviews/{reviewId}", json=reviewSummaryData, headers={
         "Content-Type": "application/json"
      })

   def create_review(self, gameId: str, scrapperSessionId:int):
      response = requests.post(f"{FLASK_API_BASE_URL}reviews", json={
         "gameId": gameId,
         "scraperSessionId": scrapperSessionId
      }, headers={
         "Content-Type": "application/json"
      })
      review_id:int = response.json()["data"]["id"]
      return review_id

   def end_review_scraping_session(self, isSuccess: bool, scraper_id: int, debug_message: str = ""):
      requests.patch(f"{FLASK_API_BASE_URL}review-session-scrapers/{scraper_id}", json = {
         "success": isSuccess,
         "endDate": datetime.now(timezone.utc).isoformat(),
         "debugMessage": debug_message
      }, headers={
         "Content-Type": "application/json"
      })

   def create_review_results(self,reviewSummaryData):
      requests.post(f"{FLASK_API_BASE_URL}reviews", json=reviewSummaryData, headers={
         "Content-Type": "application/json"
      })

   def get_active_games(self):
      games_api_response = requests.get(f"{FLASK_API_BASE_URL}games")
      games = games_api_response.json()
      return [{
         "id": x["id"],
         "name": x["name"],
         "isActive": x["isActive"]
      } for x in games["data"] if x["isActive"] == True]
   
   def create_news(self, date, title, summary, author, link, game_id, thumbnail_link):
       response = requests.post(f"{FLASK_API_BASE_URL}news", json={
         "gameId": game_id,
         "date": date,
         "author": author,
         "link": link,
         "title": title,
         "summary": summary,
         "thumbnailLink": thumbnail_link
      }, headers={
         "Content-Type": "application/json"
      })