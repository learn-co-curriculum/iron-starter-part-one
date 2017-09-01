Rails.application.routes.draw do
  namespace :api do  
    resources :campaigns, only: [:index, :show, :create, :update, :destroy] do 
      resources :comments, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
