# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Dusers::OmniauthCallbacksController, type: :controller do
  before do
    request.env['devise.mapping'] = Devise.mappings[:duser]
    request.env['omniauth.auth'] = omniauth_mock
    Duser.delete_all

  end

  let(:omniauth_mock) do
    OmniAuth::AuthHash.new(
      provider: 'events360',
      uid: '12345',
      info: {
        email: 'test@example.com',
        name: 'Test User'
      }
    )
  end

  describe 'GET #events360' do
    context 'when the user does not exist' do
      it 'creates a new user and redirects to first time user page' do
        expect {
          get :events360
        }.to change(Duser, :count).by(1)

        user = Duser.last
        expect(user.email).to eq('test@example.com')
        expect(user.name).to eq('Test User')
        expect(user.user_type).to eq('new_user')
        expect(session[:userType]).to eq('new_user')
        expect(session[:userName]).to eq('Test User')
        expect(session[:userId]).to eq(user.id.to_s)
        expect(response).to redirect_to('/home/first_time_user')
      end
    end

    context 'when the user already exists' do
      let!(:existing_user) { Duser.create!(email: 'test@example.com', name: 'Existing User', user_type: 'client') }

      it 'does not create a new user and redirects based on user type' do
        expect {
          get :events360
        }.not_to change(Duser, :count)

        expect(session[:userEmail]).to eq(existing_user.email)
        expect(session[:userType]).to eq(existing_user.user_type)
        expect(session[:userName]).to eq(existing_user.name)
        expect(session[:userId]).to eq(existing_user.id.to_s)
        expect(response).to redirect_to('/client')
      end
    end

    
  end

  describe '#get_redirect_path' do
    controller do
      def get_redirect_path(role)
        super
      end
    end

    it 'returns /admin for ADMIN role' do
      expect(controller.get_redirect_path('ADMIN')).to eq('/admin')
    end

    it 'returns /client for CLIENT role' do
      expect(controller.get_redirect_path('CLIENT')).to eq('/client')
    end

    it 'returns /user for any other role' do
      expect(controller.get_redirect_path('OTHER')).to eq('/user')
    end
  end
end
