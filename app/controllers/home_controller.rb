class HomeController < ApplicationController
  # GET /
  def index
    if is_session_valid?
      redirect_to get_redirect_path
    end
  end
  
  # GET /validation/:id
  def validation
    # u1 = Auth.find_by(:_id => params[:id])
    # typeuser = u1.user_type
    # begin
    #   if "ADMIN".casecmp? typeuser
    #     user = Producer.find_by(:_id => params[:id])
    #     user.is_valid = true
    #     user.save
    #     auth = Auth.find_by(:_id => params[:id])
    #     puts auth.email
    #     auth.is_valid = true
    #     auth.save
    #   elsif "CLIENT".casecmp? typeuser
    #     user = Client.find_by(:_id => params[:id])
    #     user.is_valid = true
    #     user.save
    #     auth = Auth.find_by(:_id => params[:id])
    #     puts auth.email
    #     auth.is_valid = true
    #     auth.save
    #   else
    #     user = Talent.find_by(:_id => params[:id])
    #     user.is_valid = true
    #     user.save
    #     auth = Auth.find_by(:_id => params[:id])
    #     puts "talent"
    #     puts auth.email
    #     auth.is_valid = true
    #     auth.save
    #   end
    #   return redirect_to root_path
    #   #render json: {redirect_path: "User validated!"}, status: 201
    # end
  end

  # POST /home/signup
  # POST /admin/signup
  def signup
    begin
      if new_user?(params[:email])
        create_user(params)
        currentUser = get_user(params[:email], params[:password])
        # UserMailer.send_welcome(params[:email], currentUser._id.to_str).deliver_now
        session[:userEmail] = currentUser.email
        session[:userType] = currentUser.user_type
        session[:userName] = currentUser.name
        session[:userId] = currentUser._id.to_str
        render json: {comment: "Account Created Sucessfully - Login now!"}, status: 400
      else
        render json: {comment: "An account with the given Email already exists!"}, status: 400
      end
    rescue => exception
      puts exception.message
      render json: {comment: "Internal Error!"}, status: 500
    end
  end
  
  # POST /home/login
  def login
    begin
      if correct_user?(params[:email], params[:password])
        currentUser = get_user(params[:email], params[:password])
        if currentUser.is_valid == false
          render json: {comment: "User not validated! Please check your mailbox for validation email."}, status: 400
          return
        elsif currentUser.is_active == false
          render json: {comment: "User is inactive. Contact the admin of the event."}, status: 400
          return
        end
        session[:userEmail] = currentUser.email
        session[:userType] = currentUser.user_type
        session[:userName] = currentUser.name
        session[:userId] = currentUser._id.to_str
        render json: {redirect_path: get_redirect_path}, status: 200
      else
        render json: {comment: "The entered Username or Password is incorrect!"}, status: 400
      end
    rescue Exception => e
      render json: {comment: e.message}, status: 500
    end
  end

  def role_selection
    begin
      # Step 1: Find the user from the session
      
      duser = Duser.find_by(_id: session[:userId])
  
      # Handle case if the user doesn't exist
      if duser.nil?
        render json: { error: "User not found" }, status: 404
        return
      end
  
      # Step 2: Check if the user's role is 'new_user'
      if duser.user_type == 'new_user'
        # Step 3: Based on the role parameter, create the appropriate role-based object
        case params[:role].upcase
        when 'ADMIN'
          # Check if Producer already exists, otherwise create
          producer = Producer.find_by(_id: session[:userId])
          if producer
            producer.update(name: session[:userName], email: session[:userEmail], is_valid: true)
          else
            Producer.create(_id: session[:userId], name: session[:userName], email: session[:userEmail], is_valid: true)
          end
  
        when 'CLIENT'
          # Check if Client already exists, otherwise create
          client = Client.find_by(_id: session[:userId])
          if client
            client.update(name: session[:userName], email: session[:userEmail], is_valid: true)
          else
            Client.create(_id: session[:userId], name: session[:userName], email: session[:userEmail], is_valid: true)
          end
  
        when 'TALENT'
          # Check if Talent already exists, otherwise create
          talent = Talent.find_by(_id: session[:userId])
          if talent
            talent.update(name: session[:userName], email: session[:userEmail], is_valid: true)
          else
            Talent.create(_id: session[:userId], name: session[:userName], email: session[:userEmail], is_valid: true)
          end
  
        else
          # Return error if role is invalid
          render json: { error: "Invalid role specified" }, status: 400
          return
        end
  
        # Update the user's role to reflect they have selected a role
        duser.update(user_type: params[:role])
  
        # Step 4: Return the redirect path
        render json: { redirect_path: get_redirect_path }, status: 200
      else
        render json: { error: "User is not a new_user" }, status: 400
      end
    rescue => e
      # Catch any unexpected errors and return a 500 server error response
      Rails.logger.error "Error in role_selection: #{e.message}"
      render json: { error: "Something went wrong" }, status: 500
    end
  end
  

  # POST /home/forgotPassword
  def forgotPassword
    # begin
    #   if user_exists?(params[:email])
    #     resetLink = generate_resetlink(params[:email])
    #     UserMailer.password_reset(params[:email], resetLink)
    #     render json: {comment: "A password reset email has been sent to your mailbox!"}, status: 400
    #     return
    #   else
    #     render json: {comment: "No such email exists."}, status: 400
    #   end
    # rescue Exception => e
    #   render json: {comment: e.message}, status: 500
    # end
  end

  def landing_page
    puts "tests"
    respond_to do |format|
      format.html { render :layout => false }
    end
  end
  
  
  
  def get_user email, password
    return Auth.find_by(:email => email, :password => password)
  end
  
  def new_user? email
    if Auth.where(:email => email).blank?
      return true
    end
    
    return false
  end
  
  def correct_user? email, password
    if Auth.where(:email => email, :password => password).present?
      return true
    end
    
    return false
  end

  def user_exists? email
    if Auth.where(:email => email).present?
      return true
    end

    return false
  end

  # def generate_resetlink email
  #   require 'securerandom'
  #   rCode = SecureRandom.hex(32)
  #   rsetCode = AuthReset.create(:resetuuid => rCode)
  #   return rCode
  # end
  
    # You can add any logic needed for first-time users here
    # For example, tracking analytics, setting flags, etc.

  end


  def create_user params
    puts (params)
    user = Auth.create(:name => params[:name], :email => params[:email], :password => params[:password], :user_type => params[:type], :is_valid => true)
    if "ADMIN".casecmp? params[:type]
      Producer.create(:_id => user._id.to_str, :name => user.name, :email => user.email, :is_valid => true)
    elsif "CLIENT".casecmp? params[:type]
      Client.create(:_id => user._id.to_str, :name => user.name, :email => user.email, :is_valid => true)
    else
      Talent.create(:_id => user._id.to_str, :name => user.name, :email => user.email, :is_valid => true)
    end
  end

  def get_redirect_path
    if "ADMIN".casecmp? session[:userType]
      return "/admin"
    elsif "CLIENT".casecmp? session[:userType]
      return "/client"
    else
      return "/user"
    end
  end

