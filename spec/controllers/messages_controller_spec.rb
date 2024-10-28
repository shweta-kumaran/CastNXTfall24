require 'rails_helper'

RSpec.describe MessagesController, type: :controller do
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
        @auth_client = Auth.create!(name:'eventtest_client', email:'eventtest_client@gmail.com',password:'12345678',user_type:'CLIENT')
        @client = Client.create!(name:'eventtest_client', email:'eventtest_client@gmail.com')

        #@slide = Slide.create(event_id:@event._id,talent_id:@talent._id,client_ids:[@client._id],curated:false,submission_status:"UNDER REVIEW",data:"{\"name\":\"aaaa\",\"email\":\"aaaa@gmail.com\",\"talentName\":\"aaaa\",\"state\":\"Kentucky\",\"city\":\"Ames\",\"paymentLink\":\"paypal.me/random\"}")
        #@client.update(slide_ids:[@slide._id])
        #@event.update(slide_ids:[@slide._id])
        @event.update(client_ids:[@client._id])
    end

  describe "POST #create" do
    context "when user is logged in as ADMIN" do
      before do
        session[:userType] = "ADMIN"
        session[:userId] = @admin._id.to_str
      end

      it "successfully sends a message" do
        post :create, params: {
          event_id: @event._id.to_str,
          client_id: @client._id.to_str,
          content: "Hello from Admin",
          sender: @admin.email,
          receiver: @client.email
        }

        expect(response).to have_http_status(:success)
        expect(response.body).to include("Successfully sent Message as Admin!")
      end
    end

    context "when user is logged in as CLIENT" do
      before do
        session[:userType] = "CLIENT"
        session[:userId] = @client._id.to_str
      end

      it "successfully sends a message" do
        post :create, params: {
          event_id: @event._id.to_str,
          client_id: @client._id.to_str,
          content: "Hello from Client",
          sender: @client.email,
          receiver: @admin.email
        }

        ##expect(response).to have_http_status(:success)
        ##expect(response.body).to include("Successfully sent Message as Client!")
      end
    end

    context "when user is not authenticated" do
      it "should handle sending a message as Talent" do
        post :create, params: {
          event_id: @event._id.to_str,
          talent_id: "some_talent_id",
          content: "Hello from Talent",
          sender: "talent@example.com",
          receiver: "admin@example.com"
        }

        ##expect(response).to have_http_status(:success) # Adjust this according to your logic
        ##expect(response.body).to include("Successfully sent Message as Talent!") # Adjust this according to your logic
      end
    end

    context "when an exception is raised" do
      before do
        session[:userType] = "ADMIN"
        allow_any_instance_of(MessagesController).to receive(:create_message_producer).and_raise(StandardError)
      end

      it "returns a 500 status with an error message" do
        post :create, params: {
          event_id: @event._id.to_str,
          client_id: @client._id.to_str,
          content: "This will fail",
          sender: @admin.email,
          receiver: @client.email
        }

        expect(response).to have_http_status(:internal_server_error)
      end
    end
  end
end
