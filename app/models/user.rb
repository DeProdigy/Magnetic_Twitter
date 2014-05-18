class User < ActiveRecord::Base
  attr_accessible :name, :provider, :uid

  def self.from_omniauth(auth)
    where(auth.slice("provider", "uid")).first || create_from_omniauth(auth)
  end

  def self.create_from_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["nickname"]
      user.profile_image_url = auth['extra']['raw_info']['profile_image_url'].gsub('_normal', '') # take out the minimizing part
      user.profile_banner_url = auth['extra']['raw_info']['profile_banner_url']
      user.token = auth['credentials']['token']
      user.secret = auth['credentials']['secret']
    end
  end
end
