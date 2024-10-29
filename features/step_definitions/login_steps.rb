Given /a user with email "([^\"]*)" and password "([^\"]*)" is logged in as an "([^\"]*)"/ do |email, password, user_type|
    # @user = Auth.new(name: 'Test Admin', email: email, password: password, user_type: user_type)
    # @user.save!

    visit '/home'
    # wait_for_pageload
    puts page.body

    fill_in 'loginEmail', :with => email
    fill_in 'loginPassword', :with => password
    click_button 'login'

    # login(email, password, user_type)

end