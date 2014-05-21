// overwrite the inject method because of Error: [$injector:unpr] Unknown provider: eProvider <- e error
function annotate(fn) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (typeof fn == 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        throw 'Using injection by name, should explicitly define ' +
          'requirements using $inject or an array! Function text:' +  fnText;
        argDecl = fnText.match(FN_ARGS);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
          arg.replace(FN_ARG, function(all, underscore, name){
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}


var app = angular.module("myApp", []);

app.controller("appController", function($scope, TweetCommunicator){
  $scope.chosenWords = TweetCommunicator.shareTweets;
  // emit a CountExceeded event
  $scope.$on("CountExceeded", function() {
    $scope.countExceeded = true;
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
      // if yes, add
      TweetCommunicator.shareTweets.push(word);
    }
  };

});

app.controller("bucketController", function($scope, $http, TweetCommunicator){

  $scope.removeFromBucket = function(word) {
    // remove from bucket and add check if valid
    var bucket = TweetCommunicator.shareTweets;
    bucket.splice(bucket.indexOf(word), 1);

    if ( bucket.join("").length > 140 ) {
      // display the warning if exceeded 140 characters
      $scope.$emit("CountExceeded");
    }
  };

});

// Visual change
app.directive("displayTweets", function() {
  return {
    restrict: 'A',
    scope: {
      tweetContent: '@',
      addTweet: '&'
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
        // with a space after
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
  return {
    shareTweets: []
  };
});

// tweetController.$inject = ['$scope', '$http', 'TweetCommunicator'];
// bucketController.$inject = ['$scope', '$http', 'TweetCommunicator'];







