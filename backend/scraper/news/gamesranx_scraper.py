from transformers import pipeline
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
import time
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def new_search(search:str, driver):
   search_input = driver.find_element(By.CLASS_NAME, "search-form-input")
   search_input.clear()
   search_input.send_keys("")

# create an instance of Chrome options
# Add selenium option
service = ChromeService(executable_path="C:\Program Files (x86)\chromedriver.exe")
options = Options()
options.headless = False
options.add_argument("user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
                            "Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.79")
# Configure Selenium options and download the default web driver automatically
driver = webdriver.Chrome(options=options, service=service)
# Go the target website
driver.get("https://gameranx.com/")
WebDriverWait(driver, 10).until(
   EC.presence_of_element_located((By.CLASS_NAME, "search-icon-form"))
)
search_button = driver.find_element(By.CLASS_NAME, "search-icon-form")
search_button.click()

search_input = driver.find_element(By.CLASS_NAME, "search-form-input")
search_input.clear()
search_input.send_keys("Final Fantasy XIV" + Keys.ENTER)

WebDriverWait(driver, 10).until(
   EC.presence_of_all_elements_located((By.TAG_NAME, "article"))
)

articles = driver.find_elements(By.TAG_NAME, "article")
for article in articles:
   article.click()
   time.sleep(3)
   entry_content = driver.find_element(By.CLASS_NAME, "entry-content")
   print(entry_content.text)
   print("\n\n")
   summary = summarizer(entry_content.text, max_length=500, min_length=100)
   print(summary)
   driver.back()
   break
driver.close()
