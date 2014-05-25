require 'spec_helper'

describe "Layouts" do
  describe "GET /" do
    it "exists" do
      get root_path
      response.status.should be(200)
    end
  end

  describe "GET /tweets/new" do
    it "exists" do
      get '/tweets/new'
      response.status.should be(200)
    end
  end
end
