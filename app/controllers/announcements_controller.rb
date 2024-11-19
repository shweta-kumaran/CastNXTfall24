class AnnouncementsController < ApplicationController


    # POST /admin/events/:id/announcements
      def create
          
        begin
          if is_user_logged_in?("ADMIN")
    
            create_announcement(params[:event_id],  params[:content], params[:sender], params[:for_client])
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
    
      def create_announcement eventId, messageContent, messageSender, forClient
        #UserMailer.added_announcement(client.email).deliver_now	
        Announcement.create(:event_id => eventId, :from => messageSender, :announcement => messageContent, :for_client => forClient)
      end
    
    end