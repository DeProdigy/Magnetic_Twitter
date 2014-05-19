class Tweet < ActiveRecord::Base

  def self.search(current_user)
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['MAGNETIC_TWITTER_KEY']
      config.consumer_secret     = ENV['MAGNETIC_TWITTER_SECRET']
      config.access_token        = current_user.token
      config.access_token_secret = current_user.secret
    end
    client.home_timeline
  end

  def self.clean_up(dirty_tweets)
    clean_tweets = []
    dirty_tweets.each do |tweet|
      clean_tweet = {}
      clean_tweet[:profile_image_url] = tweet.user.profile_image_url.to_s.gsub('_normal', '')
      clean_tweet[:name] = tweet.user.name
      clean_tweet[:username] = tweet.user.username
      clean_tweet[:text] = tweet.text.split(' ')
      clean_tweets << clean_tweet
    end
    clean_tweets
  end
end
