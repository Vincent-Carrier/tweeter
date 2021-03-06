/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const daysAgo = millis => {
  const now = new Date();
  const then = new Date(millis);
  const diff = now - then;
  return Math.floor(diff / 8.64e7);
};

const createTweetElement = function(tweet) {
  const $tweet = $("<article>").addClass("tweet-container");
  const $header = $("<header>").append(
    $("<img>").attr("src", tweet.user.avatars),
    $("<h3>")
      .addClass("tweet-owner")
      .text(tweet.user.name),
    $("<h4>")
      .addClass("tweet-username")
      .text(tweet.user.handle)
  );
  const $content = $("<p>")
    .addClass("tweet-content")
    .text(tweet.content.text);
  const $footer = $("<footer>").append(
    $("<p>").text(`${daysAgo(tweet.created_at)} days ago`)
  );
  const $icons = ["danger", "share", "favorite-heart-button"].map(svg => {
    return $("<img>").attr("src", `/images/${svg}.svg`);
  });
  $footer.append($icons);
  $tweet.append($header, $content, $("<hr>"), $footer);
  return $tweet;
};

const tweetData = {
  user: {
    name: "Newton",
    avatars: "https://i.imgur.com/73hZDYK.png",
    handle: "@SirIsaac"
  },
  content: {
    text: "If I have seen further it is by standing on the shoulders of giants"
  },
  created_at: 1461116232227
};

const renderTweets = tweets => {
  $tweets = tweets.map(createTweetElement).reverse();
  $("#tweets").empty();
  $("#tweets").append($tweets);
};

const fetchTweets = callback => {
  $.getJSON("/tweets", null, tweets => callback(tweets));
};

const scrollToForm = () => {
  $("#new-tweet").slideDown();
  window.scroll({
    top: $("#new-tweet").offset().top,
    behavior: "smooth"
  });
};

const submitTweet = form => {
  const data = $(form).serialize();
  const tweetText = data.split("=")[1];
  if (!tweetText || tweetText.length > 140) {
    $(".error-box").slideDown();
  } else {
    $(".error-box").slideUp();
    $.ajax({ method: "POST", url: "/tweets", data })
      .done(() => {
        $("#new-tweet textarea").val("");
        fetchTweets(tweets => renderTweets(tweets));
      })
      .fail((_, e) => console.log("Request failed:", e));
  }
};

$(document).ready(() => {
  $("#new-tweet").slideUp();

  $("#write-a-tweet").click(e => {
    e.preventDefault();
    scrollToForm();
    $("#new-tweet textarea").focus();
  });

  fetchTweets(tweets => renderTweets(tweets));

  $("#tweet-form").submit(function(e) {
    e.preventDefault();
    submitTweet(this);
  });
});
