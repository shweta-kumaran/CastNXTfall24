# frozen_string_literal: true

class SlidesController < ApplicationController
  # POST /admin/events/:id/slides
  # POST /user/events/:id/slides
  def create
    if 'ADMIN'.casecmp? session[:userType]
      create_producer_slide
    elsif 'CLIENT'.casecmp? session[:userType]
      create_client_slide
    else
      create_user_slide
    end
  end

  private

  def create_client_slide
    render json: { redirect_path: '/' }, status: 403
  end

  def create_user_slide
    if is_user_logged_in?('USER')
      eventId = params[:event_id]
      talentId = session[:userId]
      formData = params[:formData]
      event = get_event(eventId)

      if 'ACCEPTING'.casecmp? event.status
        if is_new_slide?(eventId, talentId)
          create_slide(eventId, talentId, formData)
          userTalent = Talent.find_by(_id: talentId)
          userTalent.update(talentData: formData)

          render json: { comment: 'Registered successfully!' }, status: 201
        else
          slide = get_talent_slide(eventId, talentId)

          data = {}
          data[:formData] = formData
          data[:curated] = slide.curated

          update_slide_data(slide, data)

          userTalent = Talent.find_by(_id: talentId)
          userTalent.update(talentData: formData)

          render json: { comment: 'Updated registration!' }, status: 200
        end
      else
        render json: { comment: 'Event is no longer accepting submissions!' }, status: 400
      end
    else
      render json: { redirect_path: '/' }, status: 403
    end
    # rescue Exception
    #   render json: {comment: "Internal Error!"}, status: 500
  end

  def create_producer_slide
    if is_user_logged_in?('ADMIN')
      eventId = params[:event_id]
      if !params[:aName].nil?
        begin
          talent = Talent.find_by(email: params[:data][:email])
        rescue Exception
          talent = Talent.create(name: params[:data][:talentName], email: params[:data][:email])
        end
        get_event(eventId)
        formData = "{\"name\":\"#{params[:data][:talentName]}\", " \
            "\"email\":\"#{params[:data][:email]}\", " \
            "\"talentName\":\"#{params[:data][:talentName]}\", " \
            "\"state\":\"#{params[:data][:state]}\", " \
            "\"city\":\"#{params[:data][:city]}\", " \
            '"paymentLink":"add your link here"}'

        create_slide(eventId, talent._id, formData)
        render json: { comment: 'Updated tables' }, status: 200
      else
        event = get_event(eventId)

        update_event_clients(event, params[:clients])
        update_event_slides(params[:slides])

        render json: { comment: 'Updated Event Decks!' }, status: 200
      end
    else
      render json: { redirect_path: '/' }, status: 403
    end
    # rescue Exception
    #   render json: {comment: "Internal Error!"}, status: 500
  end

  def update_event_slides(data)
    data.each_key do |slideId|
      puts slideId
      puts data[slideId]
      slide = get_slide(slideId)
      update_slide_data(slide, data[slideId])
    end
  end

  def update_event_clients(event, data)
    eventSlideIds = get_event_slide_ids(event)
    clients = Client.all

    clients.each do |client|
      clientId = client._id.to_str
      otherEventSlides = []

      client.slide_ids.each do |slideId|
        otherEventSlides << slideId.to_str unless eventSlideIds.include? slideId.to_str
      end

      clientEventIds = client.event_ids
      clientEventIds.delete(event._id)
      unless data[clientId][:slideIds].empty?
        clientEventIds << event._id

        if negotiation_exists?(clientId, event._id)
          negotiation = get_negotiation(clientId, event._id)
          update_negotiaton_intermediates(negotiation, data[clientId][:slideIds])
        else
          create_negotiaton(event._id, clientId, data[clientId][:slideIds])
        end
      end

      clientSlideIds = otherEventSlides + data[clientId][:slideIds]
      update_client_slides(client, clientSlideIds, clientEventIds)
      UserMailer.client_assigned(client.email).deliver_now
    end
  end

  def get_event_slide_ids(event)
    eventSlideIds = []

    event.slide_ids.each do |slideId|
      eventSlideIds << slideId.to_str
    end

    eventSlideIds
  end

  def get_event(eventId)
    Event.find_by(_id: eventId)
  end

  def get_slide(slideId)
    Slide.find_by(_id: slideId)
  end

  def get_slide_comments(slideId)
    Comment.where(slide_id: slideId)
  end

  def get_slide_client_producer_comments(slideId, clientId, _producerId)
    Comment.where(slideId: slideId, client_id: clientId, producer_id: producer_id)
  end

  def get_talent_slide(eventId, talentId)
    Slide.find_by(event_id: eventId, talent_id: talentId)
  end

  def update_client_slides(client, clientSlideIds, clientEventIds)
    client.update(slide_ids: clientSlideIds, event_ids: clientEventIds)
  end

  def create_slide(eventId, talentId, data)
    Slide.create(event_id: eventId, talent_id: talentId, curated: false, submission_status: 'UNDER REVIEW',
                 data: data)
  end

  def update_slide_data(slide, data)
    slide.update(curated: data[:curated], data: data[:formData])
  end

  def is_new_slide?(eventId, talentId)
    return true if Slide.where(event_id: eventId, talent_id: talentId).blank?

    false
  end

  def get_negotiation(clientId, eventId)
    Negotiation.find_by(event_id: eventId, client_id: clientId)
  end

  def create_negotiaton(eventId, clientId, intermediateSlideIds)
    Negotiation.create(event_id: eventId, client_id: clientId, intermediateSlides: intermediateSlideIds,
                       finalSlides: [])
  end

  def update_negotiaton_intermediates(negotiation, intermediateSlideIds)
    negotiation.update(intermediateSlides: intermediateSlideIds)
  end

  def negotiation_exists?(clientId, eventId)
    return true if Negotiation.where(event_id: eventId, client_id: clientId).present?

    false
  end
end
