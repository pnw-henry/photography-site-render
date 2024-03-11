class FrontendController < ApplicationController
  before_action :set_headers, only: [:index]

  def index
    file_path = Rails.root.join('public', 'index.html')
    if File.exist?(file_path)
      send_file(file_path, type: 'text/html', disposition: 'inline')
    else
      raise ActionController::RoutingError, 'Not Found'
    end
  end

  private
  def set_headers
    if request.path.ends_with?('.js')
        response.headers["Content-Type"] = "application/javascript"
    end
   end
end