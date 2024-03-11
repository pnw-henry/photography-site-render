Rails.application.routes.draw do
  resources :photographs, only: [:index]
  get '*path', to: 'frontend#index'
  get '/', to: 'frontend#index'

  # Defines the root path route ("/")
  root "render#index"
end