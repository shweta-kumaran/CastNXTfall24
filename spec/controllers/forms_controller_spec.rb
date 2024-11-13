require 'rails_helper'
RSpec.describe FormsController, type: :controller do
    before do
        Producer.destroy_all
        Client.destroy_all
        Talent.destroy_all
        Auth.destroy_all
        Event.destroy_all
        @auth_test = Auth.create!(name:'formtest', email:'formtest@gmail.com',password:'12345678',user_type:'ADMIN')
        @admin=Producer.create!(name:'formtest', email:'formtest@gmail.com')
        @form = Form.create!(producer_id:@admin._id.to_str,)
        @event = Event.create!(title: "test",producer_id:@admin._id.to_str,status:"ACCEPTING",form_id:@form._id.to_str)
        session[:userName]="formtest"
        session[:userEmail]="formtest@gmail.com"
        session[:userId]=@admin._id.to_str
    end
    describe "forms#show" do
        it "should show form" do
            session[:userType]="ADMIN"
            get :show, params: { id: @form._id.to_str }
            expect(response).to have_http_status(:success)
        end
        it "should failed if not authenticated" do
            session[:userType]="CLIENT"
            get :show, params: { id: @form._id.to_str }
            expect(response).to_not have_http_status(:success)
        end
        it "should handle exceptions" do
            session[:userType] = "ADMIN"
            allow(controller).to receive(:get_form).and_raise(StandardError) # Mocking an exception
            get :show, params: { id: @form._id.to_str }
            expect(response).to have_http_status(:internal_server_error) # Expect 500 status
            expect(response.body).to include("Internal Error!") # Ensure error message is returned
          end

    end
    describe "forms#create" do 
        it "should create form" do
            session[:userType]="ADMIN"
            post :create, params: {data:""}
            expect(response).to have_http_status(:success)
        end
        it "should handle validation errors when creating form" do
            session[:userType] = "ADMIN"
            allow(Form).to receive(:create!).and_raise(StandardError)
            
            post :create, params: { data: "" } # Assuming this data causes validation failure
            
            #expect(response).to have_http_status(:internal_server_error) # Expect 500 status
            #expect(response.body).to include("Internal Error!") # Ensure error message is returned
          end
        it "should create form" do
            session[:userType]="CLIENT"
            post :create, params: {data:""}
            expect(response).to_not have_http_status(:success)
        end
    end
end