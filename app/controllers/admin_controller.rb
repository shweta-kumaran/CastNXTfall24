# frozen_string_literal: true

class AdminController < ApplicationController
  # GET /admin
  def index
    return redirect_to root_path unless is_user_logged_in?('ADMIN')

    tableData = []

    eventIds = get_producer_event_ids(session[:userId])
    puts session[:userId]
    eventIds.each do |eventId|
      event = get_event(eventId)

      object = {
        id: event._id.to_str,
        title: event.title,
        status: event.status,
        delete_time: event.delete_time,
        category: event.category
      }

      tableData << object
    end
    @properties = { name: session[:userName], tableData: tableData }
  end

  private

  def get_event(eventId)
    Event.find_by(_id: eventId)
  end

  def get_producer_event_ids(producerId)
    Producer.find_by(_id: producerId).event_ids
  end
end
