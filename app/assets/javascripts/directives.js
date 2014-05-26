// Visual change
angular.module('myApp.directives', []).
  directive("displayTweets", function() {
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
  }).

  directive("removableTweets", function() {
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
