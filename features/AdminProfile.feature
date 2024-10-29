Feature: Admin Profile page
    As an admin
    I want to see a list of my events
    So that I can manage them

Scenario: Admin can see list of their events and can create new events
    Given a user with email "admin@example.com" and password "123456qt" is logged in as an "admin"
    When the user navigates to the Admin Profile page
    Then the user should see a list of their events
    # And the user should see a button to create a new event