# Steam Sentiment Nexus

## Project Overview

The live service business model is a common practice in today’s video game market. In the past, gamers purchased physical copies of games, and that was the final version of the game. With live service, however, video game developers can make changes to the game, for better or worse. This capability can cause shifts in gamers’ overall sentiment toward these games.

Steam is currently the largest digital video game distribution platform, hosting a large community of gamers who actively voice their opinions on games. Unlike game review platforms like Metacritic, where reviewers rate games on a numerical scale, Steam’s rating system is based on a simple "yes" or "no" recommendation. Users also have the opportunity to elaborate on their recommendations in text. While this approach captures more extreme sentiments, it can be challenging for users whose opinions fall somewhere in the middle to express the extent to which they recommend or don’t recommend a game.

In an effort to create more granular review scores, a sentiment analysis study will be conducted on Steam reviews using the RoBERTa model over time, examining how certain events may affect these reviews for a select number of games. Reviews will be scraped from Steam’s web API, and news will be scraped from video game news websites such as Gameranx.

## Technologies Used

- React
- Flask
- SQLAlchemy
- Selenium
- PostgreSQL

## Deploying Locally

### Backend

1. On one terminal, cd into /backend and install the dependencies from requirements.txt.
   `pip install -r requirements.txt`
2. Set up the following environment variables in a .env file:

```
DATABASE_CONNECTION_STRING= #Your connection string (i.e. local SQLite database or online database service)
ADMIN_USERNAME= # Admin username
ADMIN_PASSWORD=# Admin's hashed password
SECRET_KEY= # Your custom secret key
PASSWORD= # The unhashed password that the scrapers will used to login with. This should be a valid password that satisfies the ADMIN_PASSWORD.
```

3. Initalize the server by inserting the following into the command line:
   `py -m app`

### Frontend

1. On a separate terminal, cd into /frontend and install the npm packages
   `npm install`
2. Set up the environment variables in a .env file:

```
   VITE_API_ROUTE= # backendRoute/api
```

3. Initalize the frontend by inserting the following into the command line:
   `npm run dev`

## Scrapers

These scrapers can be run on a regular basis using batch files. You can customize your own batch files as well as setting a Windows task scheduler to cater to your own needs.

### steam_review_scraper.py

The purpose of this scraper is to scrape reviews and analyze their sentiment for each game in the **_steam_games_** table that are marked as active.

### gameranx_scraper.py

This file web scrapes Gameranx.com for gaming news for each game in the **_steam_games_** table that are marked as active. It also summarizes each article.
