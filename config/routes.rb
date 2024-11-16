Rails.application.routes.draw do

  ## == Devise OAuth ==
devise_for :dusers,
controllers: { omniauth_callbacks: 'dusers/omniauth_callbacks' },
omniauth_providers: %i[events360]

  
  root 'home#landing_page'
  get 'home', to: 'home#index'
  get '/logout', to: 'application#logout'

  get '/validation/:id', to: 'home#validation'
  
  get '/api/change_status/:id', to: 'api#change_status'

  get '/api/', to: 'api#index'
  
  resources :home, only: [] do
    post 'login', :on => :collection
    post 'signup', :on => :collection
    post 'forgotPassword', :on => :collection
  end
  
  resources :user, only: [:index] do
    collection do
      resources :events, only: [:show] do
        resources :slides, only: [:create]
        resources :messages, only: [:create]
      end
    end
  end
  
  resources :client, only: [:index] do
    collection do
      resources :events, only: [:show] do
        resources :negotiations, only: [:create]
        resources :messages, only: [:create]
        resources :slides, only: [:create] do
          resources :comments, only: [:create]
        end
      end
    end
  end
  
  resources :admin, only: [:index] do
    collection do
      resources :events, only: [:show, :update, :new, :create, :edit] do
        resources :negotiations, only: [:create]
        resources :messages, only: [:create]
        resources :announcements, only: [:create]
        resources :slides, only: [:create, :destroy] do
          resources :comments, only: [:create]
        end
      end
      resources :forms, :only => [:show, :create]
    end
  end
  
  resources :slides, only: [] do
    member do
      post 'update_payment_status'
      get 'payment_status'
    end
  end
end

 