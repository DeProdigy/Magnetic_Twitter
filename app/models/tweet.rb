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

end
