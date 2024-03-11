Rails.application.routes.draw do
  resources :photographs, only: [:index]
  # Catch-all route for React Router:
  # This should be the last route in the file to ensure it doesn't override others.
  get '*path', to: 'frontend#index'
  root to: 'frontend#index'
end