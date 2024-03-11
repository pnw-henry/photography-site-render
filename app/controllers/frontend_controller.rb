class FrontendController < ApplicationController
  def index
    send_file Rails.root.join('public', 'build', 'index.html'), type: 'text/html', disposition: 'inline'
  end
end