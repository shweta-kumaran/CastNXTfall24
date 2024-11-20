Feature: Client Profile page
  As a client
  I want to see a list of my projects
  So that I can manage them

  Scenario: Client can see list of projects
    Given a client with email "client@example.com" and password "client123" is logged in as a "client"
    When the client navigates to the Client Homepage
    Then the client should see a list of projects