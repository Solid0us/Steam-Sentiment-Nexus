from transformers import pipeline, AutoTokenizer
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from services.scraper_services import ScraperService
from datetime import datetime


def new_search(search:str, driver):
   search_input = driver.find_element(By.CLASS_NAME, "search-form-input")
   search_input.clear()
   search_input.send_keys("")

def split_text(text, max_length=512):
   # Split text into chunks of max_length
   return [text[i:i+max_length] for i in range(0, len(text), max_length)]

def is_relevant_article(title: str, game_name: str):
   title_normalized = title.replace("’", "'")
   if game_name.lower() in title_normalized.lower():
      return True
   return False

def is_article_recent(month_ago_unix:int, article_date_unix: int):
   if month_ago_unix > article_date_unix:
      return False
   return True

def main():
   # Initalize summarizer and driver settings
   model = "facebook/bart-large-cnn"
   summarizer = pipeline("summarization", model=model, truncation=True)
   tokenizer = AutoTokenizer.from_pretrained(model)
   service = ChromeService(executable_path="C:\Program Files (x86)\chromedriver.exe")
   options = Options()
   options.headless = False
   options.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
                              "Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.79")
   driver = webdriver.Chrome(options=options, service=service)

   current_time = time.mktime(datetime.now().timetuple())
   month_before_now = current_time - 2.592e+6

   # Fetch Games
   api_service = ScraperService()
   games = api_service.get_active_games()


   driver.get("https://gameranx.com/")
   WebDriverWait(driver, 10).until(
      EC.presence_of_element_located((By.CLASS_NAME, "search-icon-form"))
   )
   for game in games:
      search_button = driver.find_element(By.CLASS_NAME, "search-icon-form")
      search_button.click()

      search_input = driver.find_element(By.CLASS_NAME, "search-form-input")
      search_input.clear()
      search_input.send_keys(game["name"] + Keys.ENTER)
      
      try:
         WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "article"))
         )
      except:
         continue

      next_page_exists = True
      while next_page_exists == True:
         articles = driver.find_elements(By.TAG_NAME, "article")
         reached_end = False
         for article in articles:
            article_title = article.find_element(By.CLASS_NAME, "entry-title").text
            article_date = article.find_element(By.CLASS_NAME, "entry-time").text
            article_date_obj = datetime.strptime(article_date, "%B %d, %Y")
            article_unix = int(time.mktime(article_date_obj.timetuple()))
            article_link = article.find_element(By.CLASS_NAME, "entry-title-link").get_attribute("href")
            if not is_article_recent(article_date_unix=article_unix, month_ago_unix=month_before_now):
               print("End of recent articles")
               next_page_exists = False
               reached_end = True
               break
            article_author = article.find_element(By.CLASS_NAME, "entry-author").text
            print(f"Summary for: {article_title}")
            print(f"Date: {article_date}, written by {article_author}")
            if not is_relevant_article(title=article_title , game_name=game["name"]):
               print("Not a relevant article")
               time.sleep(3)
               continue
            time.sleep(3)
            article.click()
            time.sleep(1)
            entry_content = driver.find_element(By.CLASS_NAME, "entry-content")
            main_article_p_tags = entry_content.find_elements(By.TAG_NAME, "p")
            main_article_text_list = []
            for p in main_article_p_tags:
               if (p.text):
                  main_article_text_list.append(p.text.strip())
            concated_article_text = " ".join(main_article_text_list)
            inputs = tokenizer(concated_article_text, return_tensors="pt", max_length=1024, truncation=True)
            truncated_text = tokenizer.decode(inputs['input_ids'][0], skip_special_tokens=True)
            summary = summarizer(truncated_text,  max_length=150, min_length=10)[0]["summary_text"]
            api_service.create_news(author=article_author, date=datetime.fromtimestamp(article_unix).isoformat(), game_id=game["id"], 
                                       link=article_link, summary=summary, title=article_title, )
            driver.back()
            time.sleep(3)
         if not reached_end:
            try:
               next_page_elem = driver.find_element(By.CLASS_NAME, "pagination-next")
               next_page_elem.click()
               time.sleep(5)
            except:
               next_page_exists = False
         else:
            time.sleep(5)
         
   driver.close()

main()