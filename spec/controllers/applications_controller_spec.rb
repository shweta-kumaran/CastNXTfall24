describe ApplicationController, type: :controller do
    describe '#logout' do
      before do
        session[:userEmail] = "user@example.com"
        session[:userType] = "CLIENT"
        session[:userName] = "Test User"
        session[:userId] = "12345"
      end
  
      it 'resets the session and returns a redirect path' do
        get :logout  # Use GET since the route is defined as a GET request
  
        expect(response).to have_http_status(:ok)  # Expecting a 200 OK response
        expect(JSON.parse(response.body)["redirect_path"]).to eq("/")  # Expecting the correct redirect path
        expect(session[:userEmail]).to be_nil  # Ensure the session is reset
        expect(session[:userType]).to be_nil
        expect(session[:userName]).to be_nil
        expect(session[:userId]).to be_nil
      end
    end
  end
  