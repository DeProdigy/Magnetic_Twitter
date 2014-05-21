class TweetsController < ApplicationController
  protect_from_forgery :except => :post_tweet
  respond_to :json

  def index

  end

  def new

  end

  def api
    dirty_tweets = Tweet.search(current_user)
    clean_tweets = Tweet.clean_up(dirty_tweets)

    respond_with clean_tweets
  end

  def post_tweet
    Tweet.post(params[:tweet], current_user)
  end
end

