angular.module('myApp.factories', []).
  factory("TweetCommunicator", function() {
    // allows communication between the two controllers
    // better separation of concerns for testing
    return {
      shareTweets: []
    };
  });
