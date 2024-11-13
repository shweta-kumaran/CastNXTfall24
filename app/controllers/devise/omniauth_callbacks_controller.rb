class Devise::OmniauthCallbacksController < DeviseController
    # You should configure your model like this:
    devise :omniauthable, omniauth_providers: [:events360]
  
    def events360
      # Create an instance of Dusers::OmniauthCallbacksController
      duser_callback_controller = Dusers::OmniauthCallbacksController.new
  
      # Call the 'events360' action of the Dusers::OmniauthCallbacksController
      # Pass the request and response context to it
      duser_callback_controller.events360
    end
  end
  