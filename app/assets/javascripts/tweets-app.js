var app = angular.module("myApp", []);

app.controller("appController", function($scope, TweetCommunicator){
  $scope.chosenWords = TweetCommunicator.shareTweets;
});

app.controller("tweetController", ['$scope', '$http', 'TweetCommunicator', function($scope, $http, TweetCommunicator) {
  // get tweets through creating a service that makes ajax call to rails server
  $scope.tweets = [];

  $http.get('/tweets/api.json').success(function(data){
    $scope.tweets = data;
  });

  $scope.addToBucket = function(word) {
    TweetCommunicator.shareTweets.push(word);
  };
}]);

app.directive("displayTweets", function() {
  return {
    restrict: 'A',
    scope: {
      tweetContent: '@',
      addTweet: '&',
      removeTweet: '&'
    },
    link: function(scope, elm, attrs) {
      function addWord() {
        // with a space after
        var word = scope.tweetContent + ' ';
        scope.$apply(function() {
          scope.addTweet({word: word});
        });
        // prevent from clicking on the word again
        elm.unbind('click', addWord);
        // add method of removing the word
        elm.bind('click', removeWord);
      }
      // function removeWord() {
      //   debugger;
      //   var word = scope.tweetContent;
      //   scope.$apply(function() {
      //     scope.removeTweet({word: word});
      //   });
      //   elm.remove();
      // }
      elm.bind('click', addWord);
    }
  };
});

app.factory("TweetCommunicator", function() {
  return {
    shareTweets: []
  };
});






