var app = angular.module("myApp", []);

app.controller("appController", function($scope, TweetCommunicator){
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

});

app.controller("tweetController", function($scope, $http, TweetCommunicator) {
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

});

app.controller("bucketController", function($timeout, $scope, $http, TweetCommunicator){

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

// Visual change
app.directive("displayTweets", function() {
  //create an isolate scope - based upon attributes on the directive element
  // @ reads from the controller, must use {{ }} around the expression, read only, not write
  // & allows you to pass data out of the directive by calling a function on the controller scope
  // in this case the function parameter must be passed as an object i.e. {word: word}
  return {
    restrict: 'A',
    scope: {
      tweetContent: '@',
      addTweet: '&'
    },
    link: function(scope, elm, attrs) {
      function addWord() {
        // add a space after the word
        var word = scope.tweetContent + ' ';
        // normally changes on the scope would cause angular to automatically run a digest cycle
        // updating dom elements bound to the scope, but because we update the scope inside jQuery
        // bind we must call $apply to force the digest cycle
        scope.$apply(function() {
          scope.addTweet({word: word});
        });
        // unbind the click event to prevent from the user from clicking on the word again
        elm.unbind('click', addWord);
      }
      elm.bind('click', addWord);
    }
  };
});

app.directive("removableTweets", function() {
 return {
    restrict: 'A',
    scope: {
      tweetContent: '@',
      removeTweet: '&'
    },
    link: function(scope, elm, attrs) {
      function removeWord() {
        var word = scope.tweetContent;
        scope.$apply(function() {
          scope.removeTweet({word: word});
        });
      }
      elm.bind('click', removeWord);
    }
  };
});

app.factory("TweetCommunicator", function() {
  // allows communication between the two controllers
  // better separation of concerns for testing
  return {
    shareTweets: []
  };
});






