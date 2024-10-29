# frozen_string_literal: true

When /the user navigates to the Admin Profile page/ do
    visit '/admin'
end

Then /the user should see a list of their events/ do
    expect(page).to have_content('Event')
end

# Then /the user should see a button to create a new event/
#     expect(page).to have_selector('create-event')