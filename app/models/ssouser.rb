# frozen_string_literal: true

# Model for Users
class Ssouser < ApplicationRecord
    # Include default devise modules. Others available are:
    # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
    devise :omniauthable, omniauth_providers: %i[events360]
  
    # Custom Validations
    validates :uid, presence: true
    validates :provider, presence: true
    validates :uid, uniqueness: { scope: :provider, message: 'and provider combination must be unique' }
    validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  
     
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
        user_info = {
          uid: auth.uid.to_s,
          provider: auth.provider.to_s,
          email: auth.info.email,
          name: auth.info.name
        }
  
        user = Ssouser.find_by(uid: user_info[:uid], provider: user_info[:provider])
  
        if user.present?
          user.update(user_info)
          user
        else
          Ssouser.create(user_info)
        end
      end
    end
  end