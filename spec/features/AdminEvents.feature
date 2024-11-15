Feature: Admin events

  Background: Events in database
    Given you are logged in with the following credentials:
      | Email          | Password |
      | admin@example.com | 123456qt |
    And the following events exist: 
      | Event title | Event description | Date       | State    | Location | Category | Paid |
      | Miu Miu     | Miu Miu showcase  | 2024-12-19 | New York | Albany   | Fashion  | Yes  |


      Scenario: Event information displayed
        Given the user navigates to the Admin Homepage
        When the user presses the event "Miu Miu"
        Then the user should see "Miu Miu"
        And the user should see "Albany, New York"
        And the user should see "2024-12-19"
        And the user should see "Fashion"

      Scenario: Change event status
        Given the user is on the homepage for "Miu Miu"
        When the user presses "REVIEWING"
        # Then the user should see the popup "Are you sure you want to change the event status?"
      #   When the user presses "OK"
      #   Then the user should redirect to Admin Homepage
      #   And the user should see the status for "Miu Miu" as "Reviewing"