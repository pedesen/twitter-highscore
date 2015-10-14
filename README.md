# twitter-highscore
A local node app which is showing highscores based on a twitter timeline

<img src="http://www.pedesen.de/images/highscore.png" width="600"/>

## Getting Started

Create a new Twitter App here: https://apps.twitter.com/

Paste your twitter credentials from the link above into config.json

Run the development server (don't use in production!!):

`npm install`

`npm run start`

This servess all necessary files on port 3000, so you can see the highscores in your browser: `http://localhost:3000`

**Please note:** There is a limit of requests to the Twitter API! Only 180 requests (200 tweets each) are allowed per 15 minutes ([more info](https://dev.twitter.com/rest/reference/get/statuses/user_timeline)). You can reduce the amount of requests by setting the *since_id* property to the latest possible tweet.
