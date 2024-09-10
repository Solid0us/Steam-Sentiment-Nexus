cd ../backend
start py -m app
%SendKeys% {Enter}
cd ./scraper
timeout /t 10 /nobreak
start py -m steam_review_scraper