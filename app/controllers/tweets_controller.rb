class TweetsController < ApplicationController
  def new
    @tweets = Tweet.search(current_user)
 end
end

