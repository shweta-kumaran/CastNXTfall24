# frozen_string_literal: true
require 'devise'
class Dusers::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # You should configure your model like this:
  #devise :omniauthable, omniauth_providers: [:events360]

  # You should also create an action method in this controller like this:
  def events360
    Rails.logger.info "Here viewed"
    
    auth = request.env['omniauth.auth']
    Duser.from_omniauth_events360(auth)

    email = auth.info.email

    user = Duser.find_by(email: email)

# Check if the user was found
if duser
  # User found, proceed with a different path
  # Set session details for the existing user
  session[:userEmail] = duser.email
  session[:userType] = duser.user_type
  session[:userName] = duser.name
  session[:userId] = duser.id.to_s
  
  
  if "ADMIN".casecmp? session[:userType]
    redirect_to "/admin"
  elsif "CLIENT".casecmp? session[:userType]
    redirect_to "/client"
  else
    redirect_to "/user"
  end
  # Render message for an existing user
    
   # render json: { comment: "successful Oauth for this email. Role selection and Session creation capability is still in progress.", email: email }, status: 400

#     ## at this point we have an entry in duser - to be completed in next phase of the feature
    
else 


  render json: { comment: "successful Oauth for this email. Role selection and Session creation capability is still in progress.", email: email }, status: 400

     
  end

  # More info at:
  # https://github.com/heartcombo/devise#omniauth

  # GET|POST /resource/auth/twitter
  # def passthru
  #   super
  # end

  # GET|POST /users/auth/twitter/callback
  # def failure
  #   super
  # end

  # protected

  # The path used when OmniAuth fails
  # def after_omniauth_failure_path_for(scope)
  #   super(scope)
  # end
end

## function copied from homecontroller class - check for reuse 
