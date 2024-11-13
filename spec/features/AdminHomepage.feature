Feature: Admin Profile page
    As an admin
    I want to see a list of my events
    So that I can manage them

Scenario: Admin can see list of their events and can create new events
    Given a user with email "admin@example.com" and password "123456qt" is logged in as an "admin"
    When the user navigates to the Admin Homepage
    Then the user should see a list of their events
    And the user should see a button to create a new event

# Scenario: Successfully create new event
#     Given the user navigates to the Admin Homepage
#     When the user presses "Create New Event"
#     Then the user should be on the "Create New Event" page
#     When the user fills in the form with valid information
#         | Field             | Value                     |
#         | Event title       | Miu Miu Event             |
#         | Event description | Fashion event for Miu Miu |
#         | Date              | 05/20/2025                |
#         | State             | New York                  |
#         | Location          | New York                  |
#         | Category          | Fashion                   |
#         | Paid              | No                        |
#     And the user clicks on the "Create Event" button
#     Then the user should redirect to the Admin Homepage
#     And the user should see "Miu Miu Event" in the list of events
#     And the user should see "Status" as "ACCEPTING"
#     And the user should see "Category" as "Fashion"

Scenario: Create new event with missing information
    Given the user navigates to the Admin Homepage
    When the user presses "Create New Event"
    Then the user should be on the "Create New Event" page
    When the user fills in the form with missing information
        | Field             | Value                     |
        | Event title       | Missing Event             |
        | Event description | New Event                 |
    And the user clicks on the "Create Event" button
    Then the user should see the alert "Error: Please fill out all required fields"

  Background: Events in database

    Given the following events exist: 
    | Event title | Event description | Date       | State    | Location | Category | Paid |
    | Miu Miu     | Miu Miu showcase  | 2024-12-19 | New York | Albany   | Fashion  | Yes  |

  Scenario: Event information displayed
    Given the user navigates to the Admin Homepage
    When the user presses the event "Miu Miu"
    Then the user should be on homepage for "Miu Miu"
    And the user should see "Miu Miu"
    And the user should see "Location" as "Albany, New York"
    And the user should see "Date" as "2024-12-19T06:00:00.000Z"
    And the user should see "Category" as "Fashion"

  Scenario: Change event status
    Given the user is on the homepage for "Miu Miu"
    When the user presses "Reviewing"
    Then the user should see the popup "Are you sure you want to change the event status?"
    When the user presses "OK"
    Then the user should redirect to Admin Homepage
    And the user should see the status for "Miu Miu" as "Reviewing"
