cd ../backend
start py -m app
%SendKeys% {Enter}
cd ./scraper
timeout /t 10 /nobreak
start py -m scraper