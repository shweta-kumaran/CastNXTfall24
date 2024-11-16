Feature: User Profile page
  As an user
  I want to see a list of my events
  So that I can apply to them

  Scenario: User can see list of events
    Given a user with email "user@example.com" and password "123456qt" is logged in as an "user"
    When the user navigates to the User Homepage
    Then the user should see a list of events