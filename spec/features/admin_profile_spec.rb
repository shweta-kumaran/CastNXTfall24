require 'rails_helper'
RSpec.describe Auth, driver: :selenium_chrome, js: true do
    describe 'Admin Profile' do
        it 'should login as an admin' do
            visit '/home'
            fill_in 'loginEmail', with: 'admin@example.com'
            fill_in 'loginPassword', with: '123456'
            click_button 'login'
            # expect(current_path).to eq('/admin')
        # end

        # it 'should display the admin profile' do
        #     visit '/admin'
            expect(page).to have_content('Event')
        end
    end
end