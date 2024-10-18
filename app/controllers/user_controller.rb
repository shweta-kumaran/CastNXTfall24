# frozen_string_literal: true

class UserController < ApplicationController
  # GET /user
  def index
    return redirect_to root_path unless is_user_logged_in?('USER')

    acceptingTableData = []
    submittedTableData = []

    talent = get_talent(session[:userId])
    events = Event.all

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
        if 'ACCEPTING'.casecmp? event.status
          object['accepting'] = true
          object['status'] = 'SUBMITTED'
        elsif 'FINALIZED'.casecmp? event.status
          object['accepting'] = false
          object['status'] = if talent_accepted?(event._id, talent._id)
                               'ACCEPTED'
                             else
                               'REJECTED'
                             end
        else
          object['accepting'] = false
          object['status'] = event.status
        end

        submittedTableData << object
      elsif 'ACCEPTING'.casecmp? event.status
        acceptingTableData << object
      end
    end
    @properties = { name: session[:userName], acceptingTableData: acceptingTableData,
                    submittedTableData: submittedTableData }
  end

  private

  def get_talent(talentId)
    Talent.find_by(_id: talentId)
  end

  def get_event_negotiations(eventId)
    Negotiation.where(event_id: eventId)
  end

  def get_talent_slide(eventId, talentId)
    Slide.find_by(event_id: eventId, talent_id: talentId)
  end

  def talent_slide_exists?(eventId, talentId)
    return true if Slide.where(event_id: eventId, talent_id: talentId).present?

    false
  end

  def talent_accepted?(eventId, talentId)
    slide = get_talent_slide(eventId, talentId)
    negotiations = get_event_negotiations(eventId)

    negotiations.each do |negotiation|
      return true if negotiation.finalSlides.include? slide._id.to_str
    end

    false
  end
end
