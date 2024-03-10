Rails.application.routes.draw do
  resources :photographs, only: [:index]
  get '*path', to: 'frontend#index'
  get '/', to: 'frontend#index'
end