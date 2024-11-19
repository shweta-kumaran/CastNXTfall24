require 'rails_helper'

RSpec.describe Duser, type: :model do
  # Create a mock for the OmniAuth data
  let(:omniauth_data) do
    OmniAuth::AuthHash.new({
      provider: 'events360',
      uid: '123456',
      info: { email: 'testuser@example.com' }
    })
  end

  describe '.from_omniauth' do
    context 'when the provider is events360' do
      it 'calls from_omniauth_events360' do
        # Mocking the from_omniauth_events360 method
        allow(Duser).to receive(:from_omniauth_events360).with(omniauth_data).and_return(true)

        result = Duser.from_omniauth(omniauth_data)

        expect(result).to eq(true)
        expect(Duser).to have_received(:from_omniauth_events360).with(omniauth_data)
      end
    end

    context 'when the provider is not events360' do
      it 'returns nil' do
        non_events360_data = omniauth_data.merge('provider' => 'other_provider')

        result = Duser.from_omniauth(non_events360_data)

        expect(result).to be_nil
      end
    end
  end

  describe '.from_omniauth_events360' do
    context 'when auth data is valid' do
      it 'returns a user' do
        
        result = Duser.from_omniauth_events360(omniauth_data)

        expect(result).to eq("testuser@example.com")
      end
    end
end
    
  end

   