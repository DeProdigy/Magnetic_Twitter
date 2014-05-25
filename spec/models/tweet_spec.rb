require 'spec_helper'
require 'ostruct'

describe Tweet do

  before(:each) do
    @current_user = User.new
    @current_user.token = "User Token"
    @current_user.secret = "User Secret"
  end

  # has main methods
  it { Tweet.should respond_to :get_client }
  it { Tweet.should respond_to :clean_up }
  it { Tweet.should respond_to :search }
  it { Tweet.should respond_to :post }


  describe 'get_client method' do
    it 'returns a client object with user attributes' do
      client = Tweet.get_client(@current_user)
      expect(client.access_token).to eq "User Token"
      expect(client.access_token_secret).to eq "User Secret"
    end
  end

  describe 'clean_up method' do
    # create the clean tweets object
    before(:each) do
      user_hash = {
        'profile_image_url' => 'some image url_normal',
        'name' =>'some name',
        'username' => 'someUsername'}

      user = OpenStruct.new user_hash

      tweet = { 'user' => user,
        'text' => 'a bunch of text'
      }

      tweet_obj_1 = OpenStruct.new tweet
      tweet_obj_2 = OpenStruct.new tweet
      tweet_obj_3 = OpenStruct.new tweet

      dirty_tweets = []
      dirty_tweets << tweet_obj_1
      dirty_tweets << tweet_obj_2
      dirty_tweets << tweet_obj_3

      @clean_tweets = Tweet.clean_up(dirty_tweets)
    end

    it 'returns an array of 3 objects' do
      expect(@clean_tweets.length).to be 3
    end

    describe 'each clean tweet object' do
      # test a single tweet
      let(:tweet) {@clean_tweets[0]}

      it 'has a hash inside of the array' do
        expect(tweet).to be_a(Hash)
      end

      it 'has a hash inside of the array' do
        expect(tweet).to be_a(Hash)
      end

      it 'has a clean profile_image_url' do
        expect(tweet[:profile_image_url]).to eq 'some image url'
      end

      it 'has a name' do
        expect(tweet[:name]).to eq 'some name'
      end

      it 'has a username' do
        expect(tweet[:username]).to eq 'someUsername'
      end

      it 'has a array of content' do
        expect(tweet[:content]).to be_an(Array)
      end
    end
  end
end