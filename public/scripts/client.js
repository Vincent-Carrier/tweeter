/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const daysAgo = (millis) => {
  const now = new Date();
  const then = new Date(millis);
  const diff = now - then;
  return Math.floor(diff / 8.64e7);
}

const createTweetElement = function (tweet) {
  const $tweet = $('<article>').addClass('tweet-container')
  const $header = $('<header>').append(
    $('<img>').attr('src', tweet.user.avatars),
    $('<h3>').addClass('tweet-owner').text(tweet.user.name),
    $('<h4>').addClass('tweet-username').text(tweet.user.handle)
  )
  const $content = $('<p>').addClass('tweet-content')
    .text(tweet.content.text)
  const $footer = $('<footer>').append($('<p>').text(`${daysAgo(tweet.created_at)} days ago`));
  $tweet.append($header, $content, $('<hr>'), $footer);
  return $tweet;
}

const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}

const renderTweets = (tweets) => {
  $tweets = tweets.map(createTweetElement).reverse()
  $('#tweets article').replaceWith($tweets);
}

const fetchTweets = (callback) => {
  $.getJSON('/tweets', null, (tweets) => callback(tweets))
}

$(document).ready(() => {
  fetchTweets(tweets => renderTweets(tweets))
  $('#tweet-form').submit(function(e) {
    e.preventDefault();
    const data = $(this).serialize()
    console.log(data)
    const tweetText = data.split('=')[1]
    if(!tweetText || tweetText.length > 140) {
      alert("Illegal tweet format!")
    } else {
      $.ajax({method: 'POST', url: '/tweets', data})
        .done(() => {
          fetchTweets(tweets => renderTweets(tweets))
        }).fail((_, e) => console.log("Request failed:", e))
      }
  })
});
