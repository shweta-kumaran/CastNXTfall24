
# frozen_string_literal: true

require 'omniauth-oauth2'

module OmniAuth
  module Strategies
    # Custom OAuth Strategy for Event360
    class Events360 < OmniAuth::Strategies::OAuth2
      Rails.logger.info 'Loading OmniAuth::Strategies::Events360'
      option :name, 'events360'

      option :client_options, {
        site: ENV['EVENT360_URL'],
        authorize_url: "#{ENV['EVENT360_URL']}/oauth/authorize",
        token_url: "#{ENV['EVENT360_URL']}/oauth/token",
        scope: 'public'
      }

      uid do
        raw_info['id']
      end

      info do
        {
          name: raw_info['name'],
          email: raw_info['email']
        }
      end

      def raw_info
        @raw_info ||= access_token.get('/api/user').parsed
      end
    end
  end
end
