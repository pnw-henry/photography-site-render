class FrontendController < ApplicationController
    def index
        render send_file: "#{Rails.root}/public/build/index.html", layout: false, content_type: 'text/html'
    end
end