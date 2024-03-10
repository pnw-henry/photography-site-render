class FrontendController < ApplicationController
    before_action :set_headers, only: [:index]
    def index
        render file: Rails.root.join('public', 'build', 'index.html'), layout: false
    end

    def set_headers
        if request.path.ends_with?('.js')
        response.headers["Content-Type"] = "application/javascript"
    end
end