Rails.application.routes.draw do
  resources :photographs, only: [:index]

  get '*path', to: 'frontend#index', constraints: ->(request) do
  !request.xhr? && request.format.html?
  end
end