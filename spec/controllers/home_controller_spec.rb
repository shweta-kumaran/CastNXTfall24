require 'rails_helper'
RSpec.describe HomeController, type: :controller do
    before do
        Producer.destroy_all
        Client.destroy_all
        Talent.destroy_all
        Auth.destroy_all
    end
    describe 'home#landing_page' do
        it "should return the landing page" do
            get :landing_page
            expect(response).to have_http_status(:success)
        end
    end
    describe 'home#index' do
        it "should return the index" do
            get :index
            expect(response).to have_http_status(:success)
        end
        it "should automatically login if session is not set" do
            post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            get :index
            expect(response).to have_http_status(:redirect)
        end
    end
    describe 'home@signup' do
        it "returns 500 and an error message when an exception is raised" do
            allow_any_instance_of(HomeController).to receive(:new_user?).and_raise(StandardError, "Unexpected error")
            post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}

            expect(response).to have_http_status(500)
        end 

        it 'should change count if no existing producer' do
            expect{
                post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            }.to change(Producer, :count).by(1)
        end
        it 'should change count if no existing client' do
            expect{
                post :signup,params:{name:'hometest_client', email:'hometest_client@gmail.com',password:'12345678',type:'CLIENT'}
            }.to change(Client, :count).by(1)
        end
        it 'should change count if no existing talent' do
            expect{
                post :signup,params:{name:'hometest_talent', email:'hometest_talent@gmail.com',password:'12345678',type:'USER'}
            }.to change(Talent, :count).by(1)
        end
        it "should not change count if email existing" do
            post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            expect{
                post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            }.to_not change(Producer, :count)
        end
    end
    describe 'home@login' do
        
        it "returns 500 and an error message when an exception is raised" do
            # Mock `correct_user?` to raise an exception
            allow_any_instance_of(HomeController).to receive(:correct_user?).and_raise(StandardError, "Unexpected error")
            post :login,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}

            expect(response).to have_http_status(500)
        end 

        it "should failed if no matches" do

            post :login,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            expect(response).to have_http_status(400)
        end
        it "should succeed if matches" do
            post :signup,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            post :login,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            expect(response).to have_http_status(200)
        end
        it 'failed when not active' do
            Auth.create!(name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',user_type:'ADMIN',is_active:false)
            Producer.create!(name:'hometest_admin', email:'hometest_admin@gmail.com',is_active:false)
            post :login,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            expect(response).to have_http_status(400)
        end
        it 'failed when not valid' do
            Auth.create!(name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',user_type:'ADMIN',is_valid:false)
            Producer.create!(name:'hometest_admin', email:'hometest_admin@gmail.com',is_active:false)
            post :login,params:{name:'hometest_admin', email:'hometest_admin@gmail.com',password:'12345678',type:'ADMIN'}
            expect(response).to have_http_status(400)
        end
    end

end

describe HomeController, type: :controller do
    let(:valid_admin_params) { { email: 'admin@example.com', password: 'password123' } }
    let(:valid_client_params) { { email: 'client@example.com', password: 'password123' } }
    let(:valid_user_params) { { email: 'user@example.com', password: 'password123' } }
  
    before do
      allow_any_instance_of(HomeController).to receive(:is_session_valid?).and_return(true)
    end
  
    context 'when user is ADMIN' do
      it 'redirects to /admin' do
        # Simulate session variables for an ADMIN user
        session[:userType] = 'ADMIN'
  
        get :index
        expect(response).to redirect_to('/admin')
      end
    end
  
    context 'when user is CLIENT' do
      it 'redirects to /client' do
        # Simulate session variables for a CLIENT user
        session[:userType] = 'CLIENT'
  
        get :index
        expect(response).to redirect_to('/client')
      end
    end
  
    context 'when user is a regular user' do
      it 'redirects to /user' do
        # Simulate session variables for a regular user
        session[:userType] = 'USER'
  
        get :index
        expect(response).to redirect_to('/user')
      end
    end
  end
  