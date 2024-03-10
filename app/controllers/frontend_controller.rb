class FrontendController < ApplicationController
  def index
    render file: Rails.root.join('public', 'build', 'index.html'), layout: false
  end
end