class TweetsController < ApplicationController
  respond_to :json

  def new
    dirty_tweets = Tweet.search(current_user)
    clean_tweets = Tweet.clean_up(dirty_tweets)

    respond_with clean_tweets
  end
end

