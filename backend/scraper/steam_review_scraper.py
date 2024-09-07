import requests
from urllib.parse import quote
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
from datetime import datetime, timezone
import torch
import time
from services.scraper_services import ScraperService

FLASK_API_BASE_URL = "http://localhost:5000/api/v1/"
ROBERTA_MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"

service = ScraperService()

def initialize_review_scraper():
    current_time = time.mktime(datetime.now().timetuple())
    month_before_now = current_time - 2.592e+6
    print(torch.cuda.is_available())
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    tokenizer = AutoTokenizer.from_pretrained(ROBERTA_MODEL)
    roberta_model = AutoModelForSequenceClassification.from_pretrained(ROBERTA_MODEL).to(device)
    print()
    try:
        games_list = service.get_active_games()
    except Exception as e:
        print(e)
        print("Something went wrong")
        return 
    scraper_id = service.create_review_scraping_session()
   
    for game in games_list:
        created_review_id = service.create_review(
            gameId=game["id"],
            scrapperSessionId=scraper_id
        )
        # purchase_type=all is needed for games that are for free, not paid though steam, or received the game for free
        url = f"https://store.steampowered.com/appreviews/{game['id']}?json=1&language=english&filter=recent&num_per_page=100&purchase_type=all"
        prev_cursor = "*"
        counter = 1
        reviewSummaryData = {"steamPositives": 0, "steamNegatives": 0, "steamReviewDescription": "", "robertaPosAvg": 0,
                "robertaNeuAvg": 0, "robertaNegAvg": 0, "avgHoursPlayedPos": 0, "avgHoursPlayedNeu": 0, "avgHoursPlayedNeg": 0,
                "endDate": None, "success": False, "numberScraped": 0, "steamPosAvg": 0, "steamNegAvg": 0}
        number_of_reviews = 0
        roberta_pos_sum = 0
        roberta_neu_sum = 0
        roberta_neg_sum = 0
        steam_pos_sum = 0
        steam_neg_sum = 0
        hours_played_pos_sum = 0
        hours_played_neu_sum = 0
        hours_played_neg_sum = 0
        reached_end = False
        try: 
            while reached_end == False:
                response = requests.get(f"{url}&cursor={prev_cursor}")
                print(f"Page {counter}")
                if response.status_code == 200:
                    data = response.json()
                    next_cursor = quote(data["cursor"])
                    print(f"Next Cursor: {next_cursor}")
                    if counter == 1:
                        if data["query_summary"]["num_reviews"] == 0:
                            reached_end = True
                            print(f"Game {game['id']} has no reviews.")
                            break
                        reviewSummaryData["steamPositives"] = data["query_summary"]["total_positive"]
                        reviewSummaryData["steamNegatives"] = data["query_summary"]["total_negative"]
                        reviewSummaryData["steamReviewDescription"] = data["query_summary"]["review_score_desc"]
                    counter += 1
                    for review in data["reviews"]:
                        if month_before_now > review["timestamp_updated"]:
                            print(f"30-day mark reached, there were {number_of_reviews} reviews for Game ID {game['id']}")
                            reached_end = True
                            break
                        
                        number_of_reviews += 1
                        review_text = review["review"]
                        # Steam API gives review time in minutes, will store in hours
                        
                        encoded_text = tokenizer(review_text,truncation=True,max_length=512, return_tensors="pt")
                        output = roberta_model(**encoded_text)
                        scores = output[0][0].detach().numpy()
                        scores = softmax(scores)
                        score_pos = scores[2]
                        score_neu = scores[1]
                        score_neg = scores[0]
                        max_score = max(score_pos, score_neu, score_neg)
                        try:
                            hours_played_at_review = review["author"]["playtime_at_review"] / 60 
                        except:
                            print(f"User {review['author']['steamid']} refunded the game.")
                            hours_played_at_review = review["author"]["playtime_forever"] / 60 
                        # If there happens to be a case where one or more of the sentiment scores
                        # to be equal, give the benefit of the doubt and label as more positive
                        if (max_score == score_pos):
                            hours_played_pos_sum += hours_played_at_review
                        elif (max_score == score_neu):
                            hours_played_neu_sum += hours_played_at_review
                        else:
                            hours_played_neg_sum += hours_played_at_review
                        roberta_pos_sum += score_pos
                        roberta_neu_sum += score_neu
                        roberta_neg_sum += score_neg
                        if review["voted_up"] == True:
                            steam_pos_sum += 1
                        else:
                            steam_neg_sum += 1
                    if next_cursor == prev_cursor:
                        print(f"Reached the last cursor value of {next_cursor}")
                        break
                    prev_cursor = next_cursor
                else:
                    break
            if number_of_reviews == 0:
                number_of_reviews = 1
            reviewSummaryData["robertaPosAvg"] = roberta_pos_sum / number_of_reviews
            reviewSummaryData["robertaNeuAvg"] = roberta_neu_sum / number_of_reviews
            reviewSummaryData["robertaNegAvg"] = roberta_neg_sum / number_of_reviews
            reviewSummaryData["steamPosAvg"] = steam_pos_sum / number_of_reviews
            reviewSummaryData["steamNegAvg"] = steam_neg_sum / number_of_reviews
            reviewSummaryData["avgHoursPlayedPos"] = hours_played_pos_sum / number_of_reviews
            reviewSummaryData["avgHoursPlayedNeu"] = hours_played_neu_sum / number_of_reviews
            reviewSummaryData["avgHoursPlayedNeg"] = hours_played_neg_sum / number_of_reviews
            reviewSummaryData["endDate"] = datetime.now(timezone.utc).isoformat()
            reviewSummaryData["success"] = True
            reviewSummaryData["numberScraped"] = number_of_reviews
            service.update_review(reviewId=created_review_id, reviewSummaryData=reviewSummaryData)
        except Exception as e:
            print(f"Something went wrong with game ID:{game['id']}")
            reviewSummaryData["endDate"] = datetime.now(timezone.utc).isoformat()
            reviewSummaryData["success"] = False
            reviewSummaryData["numberScraped"] = number_of_reviews
            service.update_review(reviewId=created_review_id, reviewSummaryData=reviewSummaryData)
            service.end_review_scraping_session(isSuccess=False, scraper_id=scraper_id, debug_message=e)
    # End Session when entire job is done
    service.end_review_scraping_session(isSuccess=True, scraper_id=scraper_id)
    input('Pressure "Enter" to close the console.')
    
        
initialize_review_scraper()