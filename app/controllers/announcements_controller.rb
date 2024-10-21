class AnnouncementsController < ApplicationController


    # POST /admin/events/:id/announcements
      def create
          
        begin
          if is_user_logged_in?("ADMIN")
    
            create_message_producer(params[:event_id], params[:client_id],  params[:content], params[:sender], params[:receiver])
            render json: {comment: "Successfully made Announcement as Admin!"}, status: 200
            
          elsif is_user_logged_in?("CLIENT")
            render json: {redirect_path: "/"}, status: 403
          else
            render json: {redirect_path: "/"}, status: 403
          end
        rescue Exception
          render json: {comment: Exception}, status: 500
        end
      end
    
      private
    
      def create_announcement_producer eventId, messageContent, messageSender
        # UserMailer.added_announcement(client.email).deliver_now	
        Announcement.create(:event_id => eventId, :from => messageSender, :message => messageContent)
      end
    
    end