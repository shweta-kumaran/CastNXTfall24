require 'rails_helper'

RSpec.describe AnnouncementsController, type: :controller do
  before do
    # Setup any necessary data
    Producer.destroy_all
    Client.destroy_all
    Talent.destroy_all
    Auth.destroy_all
    Event.destroy_all
    @auth_test = Auth.create!(name:'admintest_admin', email:'admintest_admin@gmail.com',password:'12345678',user_type:'ADMIN')
    @admin=Producer.create!(name:'admintest_admin', email:'admintest_admin@gmail.com')
    @form = Form.create!(producer_id:@admin._id.to_str,)
    @event = Event.create!(title: "test",producer_id:@admin._id.to_str,status:"ACCEPTING",form_id:@form._id.to_str)
  end

  describe "POST #create" do
    context "when user is logged in as ADMIN" do
      before do
        session[:userType]="ADMIN"
        session[:userName]="admintest_admin"
        session[:userEmail]="admintest_admin@gmail.com"
        session[:userId]=@admin._id.to_str
      end

      it "successfully creates an announcement" do
        post :create, params: {
          event_id: @event._id.to_str,
          content: "This is an announcement",
          sender: @admin.email
        }

        expect(response).to have_http_status(:success)
        expect(response.body).to include("Successfully made Announcement as Admin!")
      end
    end

    context "when user is logged in as CLIENT" do
      before do
        session[:userType] = "CLIENT"
        session[:userId] = "some_client_id" # Simulate a client user
      end

      it "returns a 403 status" do
        post :create, params: {
          event_id: @event._id.to_str,
          content: "This should fail",
          sender: "client@example.com"
        }

        expect(response).to have_http_status(:forbidden) # 403 status
        expect(response.body).to include("redirect_path") # Ensure redirect path is returned
      end
    end

    context "when user is not authenticated" do
      it "returns a 403 status" do
        post :create, params: {
          event_id: @event._id.to_str,
          content: "This should also fail",
          sender: "unauthorized@example.com"
        }

        expect(response).to have_http_status(:forbidden) # 403 status
        expect(response.body).to include("redirect_path") # Ensure redirect path is returned
      end
    end

    context "when an exception is raised" do
      before do
        session[:userType]="ADMIN"
        session[:userName]="admintest_admin"
        session[:userEmail]="admintest_admin@gmail.com"
        session[:userId]=@admin._id.to_str
        allow_any_instance_of(AnnouncementsController).to receive(:create_announcement).and_raise(StandardError)
      end

      it "returns a 500 status with an error message" do
        post :create, params: {
          event_id: @event._id.to_str,
          content: "This will fail",
          sender: @admin.email
        }

        expect(response).to have_http_status(:internal_server_error)
      end
    end
  end
end
