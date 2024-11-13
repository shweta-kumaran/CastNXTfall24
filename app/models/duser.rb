class Duser
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :validatable

  ## Database authenticatable
  field :email,              type: String, default: ""
  field :user_type, type: String,  default: ""
  field :name, type: String,  default: "" 
  
  ## Trackable
  # field :sign_in_count,      type: Integer, default: 0
  # field :current_sign_in_at, type: Time
  # field :last_sign_in_at,    type: Time
  # field :current_sign_in_ip, type: String
  # field :last_sign_in_ip,    type: String

  ## Confirmable
  # field :confirmation_token,   type: String
  # field :confirmed_at,         type: Time
  # field :confirmation_sent_at, type: Time
  # field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time
  include Mongoid::Timestamps
  class << self
    def from_omniauth(auth, current_user = nil)
      case auth.provider.to_s
      when 'events360'
        return self.from_omniauth_events360(auth)
      end
      nil
    end

    private

    def from_omniauth_events360(auth)
      unless auth&.auth.info&.email && auth.info&.name
        Rails.logger.error "Missing required fields in auth data: #{auth.inspect}"
        return nil # or handle it as needed
      end
      user_info = {
        uid: auth.uid.to_s,
        provider: auth.provider.to_s,
        email: auth.info.email,
        name: auth.info.name
      }

      user = Duser.find_by(email: user_info[:email])

      if user.present?
       ##do nothing
       user
      else
       # Duser.create(user_info)
       ## create  a newuser with role  
       user_info = {
        email: auth.info.email,
        name: auth.info.name,
        user_type: "new_user"
      }
      Duser.create(user_info)

      end
      
    end
  end

end