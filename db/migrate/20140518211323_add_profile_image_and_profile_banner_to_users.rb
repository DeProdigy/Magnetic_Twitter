class AddProfileImageAndProfileBannerToUsers < ActiveRecord::Migration
  def change
    add_column :users, :profile_image_url, :string
    add_column :users, :profile_banner_url, :string
  end
end
