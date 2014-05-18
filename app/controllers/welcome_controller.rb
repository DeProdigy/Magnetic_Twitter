class WelcomeController < ApplicationController
  def index
    redirect_to '/tweets/new' if current_user
  end
end

