# Steam Sentiment Nexus

## Project Overview

The live service business model is a common practice in today’s video game market. In the past, gamers purchased physical copies of games, and that was the final version of the game. With live service, however, video game developers can make changes to the game, for better or worse. This capability can cause shifts in gamers’ overall sentiment toward these games.

Steam is currently the largest digital video game distribution platform, hosting a large community of gamers who actively voice their opinions on games. Unlike game review platforms like Metacritic, where reviewers rate games on a numerical scale, Steam’s rating system is based on a simple "yes" or "no" recommendation. Users also have the opportunity to elaborate on their recommendations in text. While this approach captures more extreme sentiments, it can be challenging for users whose opinions fall somewhere in the middle to express the extent to which they recommend or don’t recommend a game.

In an effort to create more granular review scores, a sentiment analysis study will be conducted on Steam reviews using the RoBERTa model over time, examining how certain events may affect these reviews for a select number of games. Reviews will be scraped from Steam’s web API, and news will be scraped from video game news websites.

## Technologies Used

- React
- Flask
- SQLAlchemy
- Selenium
- PostgreSQL
