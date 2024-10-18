# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: 'fashionxtllc@gmail.com'

  def send_welcome(email, id)
    link = ENV['HEROKU_URL'] || 'http://localhost:3000'
    mail(
      to: email,
      subject: 'Welcome',
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          <div>
            Please click this link to validate your account: #{link}/validation/#{id}  ....
          </div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end

  def client_assigned(email)
    mail(
      to: email,
      subject: 'Talent Assigned to you',
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          Hi, you have been assigned a talent for an upcoming event. Please log in to see more details.
          <div></div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end

  def deleted_event(email, event_name, delete_time)
    mail(
      to: email,
      subject: 'An event you registered for has been deleted.',
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          Hi, Event #{event_name} has been removed by the organizer at #{delete_time}. Thanks for registering!
          <div></div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end

  def password_reset(email, reset_link)
    mail(
      to: email,
      subject: 'Password Reset Request',
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          Hi, a password reset request has been initiated. If this was not done by you, please contact an admin immediately.
          Please click on the following link to reset your email: #{reset_link}
          <div></div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end

  def added_comment(email)
    mail(
      to: email,
      subject: 'Producer has commented on your Talent.',
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          Hi, A comment has been posted on a talent that has been assigned to you!
          <div></div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end

  def form_edited(email, event_name)
    mail(
      to: email,
      subject: "New fields added to the #{event_name} form.",
      body: <<~HTML,
        <!DOCTYPE html>
        <body>
          Hi, New fields have been added to the #{event_name} form that you have submitted!
          <div></div>
        </body>
      HTML
      content_type: 'text/html'
    )
  end
end
