class MessagesController < ApplicationController


# POST /admin/events/:id/messages
  def create
  	
    begin
      if is_user_logged_in?("ADMIN")

        create_message_producer(params[:event_id], params[:client_id],  params[:content], params[:sender], params[:receiver])
        render json: {comment: "Successfully sent Message as Admin!"}, status: 200
        
      elsif is_user_logged_in?("CLIENT")
      	create_message_client(params[:event_id], params[:client_id], params[:content], params[:sender], params[receiver])
        render json: {comment: "Successfully sent Message as Client!"}, status: 200
      else
        create_message_talent(params[:event_id], params[:talent_id], params[:content], params[:sender], params[:receiver])
      end
    rescue Exception
      render json: {comment: Exception}, status: 500
    end
  end

  private

  def create_message_producer eventId, clientId, messageContent, messageSender, messageReceiver
    client = Client.find_by(:_id => clientId)
    
    # UserMailer.added_message(client.email).deliver_now	
    Message.create(:event_id => eventId, :client_id => clientId, :from => messageSender, :to => messageReceiver, :message => messageContent)
  end

  def create_message_client eventId, clientId, messageContent, messageSender, messageReceiver
    Message.create(:event_id => eventId, :client_id => clientId, :from => messageSender, :to => messageReceiver, :message => messageContent)
  end


#   def create_message_talent eventId, talentId, messageContent, messageSender, messageReceiver
#     Message.create(:event_id => eventId, :talent_id => talentId, :from => messageSender, :to => messageReceiver, :message => messageContent)
#   end


end