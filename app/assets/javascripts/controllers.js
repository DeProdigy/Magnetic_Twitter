angular.module('myApp.controllers', []).
  controller("appController", function($scope, TweetCommunicator){
    // setup data binding between the two controllers via a service
    $scope.chosenWords = TweetCommunicator.shareTweets;

    // emit events
    $scope.$on("CountExceeded", function() {
      $scope.countExceeded = true;
    });

    $scope.$on("ValidTweet", function() {
      $scope.countExceeded = false;
    });

    $scope.$on("PostedTweet", function() {
      $scope.tweetPosted = true;
    });

    $scope.$on("TurnOffPostedTweet", function() {
      $scope.tweetPosted = false;
    });

  }).
  controller("tweetController", function($scope, $http, TweetCommunicator) {
    // get tweets through creating a service that makes ajax call to rails server
    $scope.tweets = [];

    $http.get('/tweets/api.json').success(function(data){
      $scope.tweets = data;
    });

    $scope.addToBucket = function(word) {

      var tweetLength = TweetCommunicator.shareTweets.join("").length;
      // check if a valid tweet
      if ( (tweetLength + word.length) > 140 ) {
        // display the warning if exceeded 140 characters
        $scope.$emit("CountExceeded");
      } else {
        // if yes, add and remove warning
        $scope.$emit("ValidTweet");
        TweetCommunicator.shareTweets.push(word);
      }
    };

  }).
  controller("bucketController", function($timeout, $scope, $http, TweetCommunicator){

    $scope.removeFromBucket = function(word) {
      // remove from bucket and add check if valid
      var bucket = TweetCommunicator.shareTweets;

      bucket.splice(bucket.indexOf(word), 1);

      if ( bucket.join("").length > 140 ) {
        // display the warning if exceeded 140 characters
        $scope.$emit("CountExceeded");
      } else {
        $scope.$emit("ValidTweet");
      }
    };

    $scope.postTweet = function() {
      // post the tweet
      // take out the last space in the string
      var validTweet = TweetCommunicator.shareTweets.join('').trim();

      $http.post('/tweets/api', {tweet: validTweet}).success(function(response){
        console.log('posted a tweet!' + response);
        // flash sucess message for 3 seconds and reset the bucket
        $scope.$emit("PostedTweet");
        $timeout(function(){ $scope.$emit("TurnOffPostedTweet"); }, 3000);
      });
    };
  });