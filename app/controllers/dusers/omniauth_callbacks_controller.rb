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
    
    render json: { comment: "successful Oauth for this email. Role selection and Session creation capability is still in progress.", email: email }, status: 400

#     ## at this point we have an entry in duser - to be completed in next phase of the feature
    
#   session[:userEmail] = currentUser.email
#  session[:userType] = currentUser.user_type
#  session[:userName] = currentUser.name
#  session[:userId] = currentUser._id.to_str

# if @user.user_type == "new_user"
#   # Redirect for new users
#   redirect_to "/home/first-time-user"
# else
#   # Additional actions for existing users can go here if needed
#   redirect_to get_redirect_path
  
# end

     
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
def get_redirect_path
  if "ADMIN".casecmp? session[:userType]
    return "/admin"
  elsif "CLIENT".casecmp? session[:userType]
    return "/client"
  else
    return "/user"
  end
end