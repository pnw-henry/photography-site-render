Rails.application.routes.draw do
  resources :photographs, only: [:index]
end