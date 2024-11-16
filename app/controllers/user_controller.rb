class UserController < ApplicationController
  # GET /user
  def index
    unless is_user_logged_in?("USER")
      return redirect_to root_path
    end
    
    acceptingTableData = []
    submittedTableData = []
    
    talent = get_talent(session[:userId])
    talent_data = JSON.parse(talent.talentData || '{}')
    user_city = talent_data["city"] || "Portland"
    user_state = talent_data["state"] || "Oregon"

    events = Event.all
    events_near_user = []

    events.each do |event|
      object = {
        title: event.title,
        id: event._id.to_str, 
        delete_time: event.delete_time,
        category: event.category,
        date: event.eventdate,
        statename: event.statename,
        location: event.location,
        ispaid: event.is_paid_event
      }
      
      if talent_slide_exists?(event._id, talent._id)
        slide = get_talent_slide(event._id, talent._id)
        object["slideId"] = slide._id.to_str
        
        # announcements = get_event_announcements(event._id)
        announcements = []
        messages = get_event_user_messages(event._id, slide._id.to_str)
        if "ACCEPTING".casecmp? event.status
          object["accepting"] = true
          object["status"] = "SUBMITTED"
        elsif "FINALIZED".casecmp? event.status
          object["accepting"] = false
          if talent_accepted?(event._id, talent._id)
            object["status"] = "ACCEPTED"
          else
            object["status"] = "REJECTED"
          end
        else
          object["accepting"] = false
          object["status"] = event.status
        end
        object[:announcements] = []
        announcements.each do |announcement|
          object[:announcements].push({:announcementContent => announcement.announcement, :announcementFrom => announcement.from, :forClient => announcement.for_client, :timeSent => announcement.created_at})
        end
        object[:messages] = []
        messages.each do |message|
          object[:messages].push({:messageContent => message.message, :messageFrom => message.from, :messageTo => message.to, :timeSent => message.created_at, :userIds => message.user_id})
        end
        submittedTableData << object
      else
        if "ACCEPTING".casecmp? event.status
          acceptingTableData << object
        end
        if "ACCEPTING".casecmp?(event.status) && event.statename == user_state
          events_near_user << object
        end
      end
    end

    events_near_user.sort_by! do |event|
      [
        event[:location] == user_city ? 0 : 1,
        event[:date] || Date.today
      ]
    end
    @properties = {name: session[:userName], acceptingTableData: acceptingTableData, submittedTableData: submittedTableData, events_near_user: events_near_user, user_city: user_city, user_state: user_state}
  end
  
  private
  
  def get_talent talentId
    return Talent.find_by(:_id => talentId)
  end
  
  def get_event_negotiations eventId
    return Negotiation.where(:event_id => eventId)
  end

  def get_event_user_messages eventId, userId
    return Message.where(:event_id => eventId, :user_id.in => [userId])
  end
  
  def get_talent_slide eventId, talentId
    return Slide.find_by(:event_id => eventId, :talent_id => talentId)
  end
  
  def talent_slide_exists? eventId, talentId
    if Slide.where(:event_id => eventId, :talent_id => talentId).present?
      return true
    end
    
    return false
  end
  
  def talent_accepted? eventId, talentId
    slide = get_talent_slide(eventId, talentId)
    negotiations = get_event_negotiations(eventId)
    
    negotiations.each do |negotiation|
      if negotiation.finalSlides.include? slide._id.to_str
        return true
      end
    end
    
    return false
  end
end
