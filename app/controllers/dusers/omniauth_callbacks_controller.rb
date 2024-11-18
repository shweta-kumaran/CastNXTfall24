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

    @user = Duser.find_or_initialize_by(email: email)

    if @user.new_record?
      # If user does not exist, set user_type to "new_user"
      @user.name = name
      @user.user_type = "new_user"
      @user.save
    end

    # Set session values
    session[:userEmail] = @user.email
    session[:userType] = @user.user_type
    session[:userName] = @user.name
    session[:userId] = @user.id.to_s

    # Redirect based on user type
    if @user.user_type == "new_user"
      redirect_to "/home/first-time-user"
    else
      redirect_to get_redirect_path(@user.user_type)
    end
    
    private

    def get_redirect_path(role)
      case role&.upcase
      when "ADMIN"
        return "/admin"
      when "CLIENT"
        return "/client"
      else
        return "/user"
      end
    end
    
     
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
