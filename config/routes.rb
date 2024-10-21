Rails.application.routes.draw do
  resources :photographs, only: [:index]
  post 'create_payment_intent', to: 'payments#create_payment_intent'
  post 'create_checkout_session', to: 'payments#create_checkout_session'
  get 'checkout/success', to: 'payments#checkout_success'
  # Catch-all route for React Router:
  # This should be the last route in the file to ensure it doesn't override others.
  get '*path', to: 'frontend#index'
  root to: 'frontend#index'
end