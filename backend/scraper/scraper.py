import requests
import time
from urllib.parse import quote
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoConfig, pipeline
from scipy.special import softmax

FLASK_API_BASE_URL = "http://localhost:5000/"
ROBERTA_MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"

def scrape_steam_reviews(game_id: str):
    headers= {
        "Content-Type": "application/json"
    }
    tokenizer = AutoTokenizer.from_pretrained(ROBERTA_MODEL)
    # config = AutoConfig.from_pretrained(ROBERTA_MODEL)
    roberta_model = AutoModelForSequenceClassification.from_pretrained(ROBERTA_MODEL)
    scraper_api_response = requests.post(f"{FLASK_API_BASE_URL}review-session-scrapers", data={},  headers={
        "Content-Type": "application/json"
    })
    scraper_id = scraper_api_response.json()["data"]["id"]
    url = f"https://store.steampowered.com/appreviews/{game_id}?json=1&language=english&filter=recent&num_per_page=100"
    prev_cursor = "*"
    counter = 1
    reviewSummaryData = {"gameId": game_id, "steamPositives": 0, "steamNegatives": 0, "steamReviewDescription": "", "robertaPosAvg": 0,
            "robertaNeuAvg": 0, "robertaNegAvg": 0, "avgHoursPlayedPos": 0, "avgHoursPlayedNeu": 0, "avgHoursPlayedNeg": 0,
            "scraperSessionId": scraper_id}
    number_of_reviews = 0
    roberta_pos_sum = 0
    roberta_neu_sum = 0
    roberta_neg_sum = 0
    hours_played_pos_sum = 0
    hours_played_neu_sum = 0
    hours_played_neg_sum = 0
    while True:
        response = requests.get(f"{url}&cursor={prev_cursor}")
        print(f"Page {counter}")
        if response.status_code == 200:
            try:
                data = response.json()
                next_cursor = quote(data["cursor"])
                print(next_cursor)
                if counter == 1:
                    reviewSummaryData["steamPositives"] = data["query_summary"]["total_positive"]
                    reviewSummaryData["steamNegatives"] = data["query_summary"]["total_negative"]
                    reviewSummaryData["steamReviewDescription"] = data["query_summary"]["review_score_desc"]
                for review in data["reviews"]:
                    number_of_reviews += 1
                    review_text = review["review"]
                    # Steam API gives review time in minutes, will store in hours
                    hours_played_at_review = review["author"]["playtime_at_review"] / 60 
                    encoded_text = tokenizer(review_text,truncation=True,max_length=512, return_tensors="pt")
                    output = roberta_model(**encoded_text)
                    scores = output[0][0].detach().numpy()
                    scores = softmax(scores)
                    score_pos = scores[2]
                    score_neu = scores[1]
                    score_neg = scores[0]
                    # If there happens to be a case where one or more of the sentiment scores
                    # to be equal, give the benefit of the doubt and label as more positive
                    max_score = max(score_pos, score_neu, score_neg)
                    if (max_score == score_pos):
                        hours_played_pos_sum += hours_played_at_review
                    elif (max_score == score_neu):
                        hours_played_neu_sum += hours_played_at_review
                    else:
                        hours_played_neg_sum += hours_played_at_review
                    roberta_pos_sum += score_pos
                    roberta_neu_sum += score_neu
                    roberta_neg_sum += score_neg
                counter += 1
                if next_cursor == prev_cursor or counter == 3:
                    print(f"Reached the last cursor value of {next_cursor}")
                    reviewSummaryData["robertaPosAvg"] = roberta_pos_sum / number_of_reviews
                    reviewSummaryData["robertaNeuAvg"] = roberta_neu_sum / number_of_reviews
                    reviewSummaryData["robertaNegAvg"] = roberta_neg_sum / number_of_reviews
                    reviewSummaryData["avgHoursPlayedPos"] = hours_played_pos_sum / number_of_reviews
                    reviewSummaryData["avgHoursPlayedNeu"] = hours_played_neu_sum / number_of_reviews
                    reviewSummaryData["avgHoursPlayedNeg"] = hours_played_neg_sum / number_of_reviews
                    break
                prev_cursor = next_cursor
                time.sleep(1)
            except:
                print("Something unexpected happened. Aborting job.")
                requests.patch(f"{FLASK_API_BASE_URL}review-session-scrapers/{scraper_id}", json = {
                    "success": True
                }, headers=headers)
        else:
            print(f"Could not reach URL with status {response.status_code}")
            requests.patch(f"{FLASK_API_BASE_URL}review-session-scrapers/{scraper_id}", json = {
                "success": False
            }, headers=headers)
            break
    # End Session
    requests.patch(f"{FLASK_API_BASE_URL}review-session-scrapers/{scraper_id}", json = {
        "success": True
    }, headers=headers)
    # Add results to reviews table
    requests.post(f"{FLASK_API_BASE_URL}reviews", json=reviewSummaryData, headers=headers)
        
scrape_steam_reviews("39210")