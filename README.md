# twitter-highscore
A local node app which is showing highscores based on a twitter timeline

## Getting Started

Create a new Twitter App here: https://apps.twitter.com/

Create a file named config.json and paste in your twitter credentials from the link above (see config_example.json)

Add some more configuration properties to config.json:

* *screen_name*: check this user's twitter feed for highscore tweets
* *since_id*: the id of a tweet since tweets should be fetched
* *regex*: a regular expression which returns a user name as the first and the score as the second group
* *num_top*: the first x users should appear in the highscore list
* *from_date*: filter tweets which are posted earlier than this date. Format: "YYYY-MM-DD HH:MM"
* *to_date*: filter tweets which are posted later than this date. Format: "YYYY-MM-DD HH:MM"
* *refresh*: the refresh rate of the highscore list in seconds

Run the development server (don't use in production!!):

`npm install`

`npm run start`

This servess all necessary files on port 3000, so you can see the highscores in your browser: `http://localhost:3000`

**Please note:** There is a limit of requests to the Twitter API! Only 180 requests (200 tweets each) are allowed per 15 minutes ([more info](https://dev.twitter.com/rest/reference/get/statuses/user_timeline)). You can reduce the amount of requests by setting the *since_id* property to the latest possible tweet.
