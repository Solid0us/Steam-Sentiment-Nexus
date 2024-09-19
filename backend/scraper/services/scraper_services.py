import requests
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
FLASK_API_BASE_URL = "http://localhost:5000/api/v1/"

class ScraperService():
   load_dotenv()

   def __init__(self):
      self.username = os.getenv("ADMIN_USERNAME")
      self.password = os.getenv("PASSWORD")

   def login(self):
      try:
         api_response = requests.post(f"{FLASK_API_BASE_URL}auth/sign-in", json={
            "username": self.username,
            "password": self.password
         }, headers={"Content-Type": "application/json"})
         return api_response.json()["token"]
      except:
         return None

   def create_review_scraping_session(self, token):
    scraper_api_response = requests.post(f"{FLASK_API_BASE_URL}review-session-scrapers", data={},  headers={
        "Content-Type": "application/json",
         "Authorization": f"Bearer {token}"

    })
    review_session_id: int = scraper_api_response.json()["data"]["id"]
    return review_session_id

   def update_review(self, reviewId: str, reviewSummaryData, token):
      requests.patch(f"{FLASK_API_BASE_URL}reviews/{reviewId}", json=reviewSummaryData, headers={
         "Content-Type": "application/json",
         "Authorization": f"Bearer {token}"
      })

   def create_review(self, gameId: str, scrapperSessionId:int, token):
      response = requests.post(f"{FLASK_API_BASE_URL}reviews", json={
         "gameId": gameId,
         "scraperSessionId": scrapperSessionId
      }, headers={
         "Content-Type": "application/json",
         "Authorization": f"Bearer {token}"
      })
      review_id:int = response.json()["data"]["id"]
      return review_id

   def end_review_scraping_session(self, isSuccess: bool, scraper_id: int, token, debug_message: str = ""):
      requests.patch(f"{FLASK_API_BASE_URL}review-session-scrapers/{scraper_id}", json = {
         "success": isSuccess,
         "endDate": datetime.now(timezone.utc).isoformat(),
         "debugMessage": debug_message
      }, headers={
         "Content-Type": "application/json",
         "Authorization": f"Bearer {token}"
      })

   def create_review_results(self,reviewSummaryData, token):
      requests.post(f"{FLASK_API_BASE_URL}reviews", json=reviewSummaryData, headers={
         "Content-Type": "application/json",
         "Authorization": f"Bearer {token}"
      })

   def get_active_games(self):
      games_api_response = requests.get(f"{FLASK_API_BASE_URL}games")
      games = games_api_response.json()
      return [{
         "id": x["id"],
         "name": x["name"],
         "isActive": x["isActive"]
      } for x in games["data"] if x["isActive"] == True]
   
   def create_news(self, date, title, summary, author, link, game_id, thumbnail_link, token):
      response = requests.post(f"{FLASK_API_BASE_URL}news", json={
      "gameId": game_id,
      "date": date,
      "author": author,
      "link": link,
      "title": title,
      "summary": summary,
      "thumbnailLink": thumbnail_link
   }, headers={
      "Content-Type": "application/json",
      "Authorization": f"Bearer {token}"
   })
      return response