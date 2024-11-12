begin
    Rails.logger.info 'Loading custom OmniAuth strategies: Eventbrite and Events360'
    require_dependency Rails.root.join('lib', 'omniauth', 'strategies', 'events360.rb')
  rescue StandardError => e
    Rails.logger.error "Error loading OmniAuth strategies: #{e.message}"
  end