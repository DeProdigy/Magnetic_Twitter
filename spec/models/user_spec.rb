require 'spec_helper'

describe User do
  # has main methods
  it { User.should respond_to :from_omniauth }
  it { User.should respond_to :create_from_omniauth }
end
