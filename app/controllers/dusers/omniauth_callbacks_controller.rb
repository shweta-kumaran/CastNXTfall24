# frozen_string_literal: true
require 'devise'
class Dusers::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # You should configure your model like this:
  #devise :omniauthable, omniauth_providers: [:events360]

  # You should also create an action method in this controller like this:
  def events360
    ##Rails.logger.info "Here viewed"
    
    auth = request.env['omniauth.auth']
    Duser.from_omniauth_events360(auth)

    email = auth.info.email
    name = auth.info.email
    @user = Duser.where(email: email).first

    if @user.nil?
      # If user does not exist, create a new user
      @user = Duser.new(email: email, name: name, user_type: "new_user")
    
      if @user.save
        # User successfully saved to the database
        puts "User successfully created: #{@user.inspect}"
    
        # Retrieve the user from the DB after save
        @user = Duser.find_by(id: @user.id)
    
        if @user.nil?
          puts "Failed to retrieve user after saving: User ID #{@user.id} not found."
          return { error: "Failed to retrieve user after saving", details: "User not found in the database" }
        else
          # Successfully retrieved user from DB
          puts "User successfully retrieved from DB: #{@user.inspect}"
        end
      else
        # If user is not saved, log error and return failure response
        puts "Failed to save user: #{@user.errors.full_messages.join(", ")}"
        return { error: "Failed to create user", details: @user.errors.full_messages }
      end
    end
    

    # Set session values
    session[:userEmail] = @user.email
    session[:userType] = @user.user_type
    session[:userName] = @user.name
    session[:userId] = @user.id.to_s

    # Redirect based on user type
    if @user.user_type == "new_user"
      redirect_to "/home/first_time_user"
    else
      redirect_to get_redirect_path(@user.user_type)
    end
    
    

    
    
     
  end

    

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

## function copied from homecontroller class - check for reuse 
