# config/initializers/omniauth.rb
require Rails.root.join('lib/omniauth/strategies/events360.rb')

Rails.application.config.middleware.use OmniAuth::Builder do
  
    provider :events360, ENV['EVENTS360_CLIENT_ID'], ENV['EVENTS360_CLIENT_SECRET'],
             {
               scope: 'default', # Customize the scope as per Events360's requirements
               redirect_uri: 'https://127.0.0.1:3000/users/auth/events360/callback'
             }
  end
  