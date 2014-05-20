var app = angular.module("myApp", []);

app.controller("bucketController", function($scope, TweetCommunicator){
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
      addTweet: '&'
    },
    link: function(scope, elm, attrs) {
      function addWord() {
        var word = scope.tweetContent + ' ';
        scope.$apply(function() {
          scope.addTweet({word: word});
        });
        elm.unbind('click', addWord);
      }
      elm.bind('click', addWord);
    }
  };
});

app.factory("TweetCommunicator", function() {
  return {
    shareTweets: []
  };
});






