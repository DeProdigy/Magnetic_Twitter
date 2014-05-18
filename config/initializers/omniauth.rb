OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['MAGNETIC_TWITTER_KEY'], ENV['MAGNETIC_TWITTER_SECRET']
end