# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EventsController, type: :controller do
  before do
    Producer.destroy_all
    Client.destroy_all
    Talent.destroy_all
    Auth.destroy_all
    Event.destroy_all
    Comment.destroy_all
    Negotiation.destroy_all
    Slide.destroy_all

    session.clear
    @auth_test = Auth.create!(name: 'eventtest', email: 'eventtest@gmail.com', password: '12345678',
                              user_type: 'ADMIN')
    @admin = Producer.create!(name: 'eventtest', email: 'eventtest@gmail.com')

    @form = Form.create!(producer_id: @admin._id.to_str,
                         data: <<~JSON
                           {
                             "schema": {
                               "type": "object",
                               "properties": {
                                 "talentName": {
                                   "title": "Name",
                                   "type": "string"
                                 },
                                 "gender": {
                                   "title": "Gender",
                                   "type": "string",
                                   "enum": ["Male", "Female", "Other"]
                                 },
                                 "birthDate": {
                                   "title": "Birth Date",
                                   "format": "date",
                                   "type": "string"
                                 },
                                 "email": {
                                   "title": "Email",
                                   "type": "string",
                                   "description": "Enter your email address."
                                 },
                                 "state": {
                                   "title": "State",
                                   "enum": [
                                     "Alabama", "Alaska", "Arizona", "Arkansas",
                                     "California", "Colorado", "Connecticut", "Delaware",
                                     "District of Columbia", "Florida", "Georgia", "Hawaii",
                                     "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",#{' '}
                                     "Kentucky", "Louisiana", "Maine", "Maryland",#{' '}
                                     "Massachusetts", "Michigan", "Minnesota", "Mississippi",#{' '}
                                     "Missouri", "Montana", "Nebraska", "Nevada",#{' '}
                                     "New Hampshire", "New Jersey", "New Mexico",#{' '}
                                     "New York", "North Carolina", "North Dakota",#{' '}
                                     "Ohio", "Oklahoma", "Oregon", "Pennsylvania",#{' '}
                                     "Rhode Island", "South Carolina", "South Dakota",#{' '}
                                     "Tennessee", "Texas", "Utah", "Vermont",#{' '}
                                     "Virginia", "Washington", "West Virginia",#{' '}
                                     "Wisconsin", "Wyoming"
                                   ],
                                   "description": "Enter your state of residence.",
                                   "type": "string"
                                 },
                                 "city": {
                                   "title": "City",
                                   "description": "Enter your city of residence.",
                                   "enum": [
                                     "Abilene", "Addison", "Akron", "Alameda",#{' '}
                                     "Albany", "Albuquerque", "Alexandria",#{' '}
                                     "Alhambra", "Aliso Viejo", "Allen", "Allentown",#{' '}
                                     "Alpharetta", "Altamonte Springs", "Altoona",#{' '}
                                     "Amarillo", "Ames", "Anaheim", "Anchorage",#{' '}
                                     "Anderson", "Ankeny", "Ann Arbor", "Annapolis",#{' '}
                                     "Antioch", "Apache Junction", "Apex", "Apopka",#{' '}
                                     "Apple Valley", "Appleton", "Arcadia",#{' '}
                                     "Arlington", "Arlington Heights", "Arvada",#{' '}
                                     "Asheville", "Athens-Clarke County", "Atlanta",#{' '}
                                     "Atlantic City", "Attleboro", "Auburn",#{' '}
                                     "Augusta-Richmond County", "Aurora", "Austin",#{' '}
                                     "Aventura", "Avondale", "Azusa", "Bakersfield",#{' '}
                                     "Baldwin Park", "Baltimore", "Barnstable Town",#{' '}
                                     "Bartlett", "Baton Rouge", "Battle Creek",#{' '}
                                     "Bayonne", "Baytown", "Beaumont",#{' '}
                                     "Beavercreek", "Beaverton", "Bedford",#{' '}
                                     "Bell Gardens", "Belleville", "Bellevue",#{' '}
                                     "Bellflower", "Bellingham", "Beloit", "Bend",#{' '}
                                     "Bentonville", "Berkeley", "Berwyn", "Bethlehem",#{' '}
                                     "Beverly", "Billings", "Biloxi", "Binghamton",#{' '}
                                     "Birmingham", "Bismarck", "Blacksburg",#{' '}
                                     "Blaine", "Bloomington", "Blue Springs",#{' '}
                                     "Boca Raton", "Boise City", "Bolingbrook",#{' '}
                                     "Bonita Springs", "Bossier City", "Boston",#{' '}
                                     "Boulder", "Bountiful", "Bowie", "Bowling Green",#{' '}
                                     "Boynton Beach", "Bozeman", "Bradenton",#{' '}
                                     "Brea", "Bremerton", "Brentwood", "Bridgeport",#{' '}
                                     "Bristol", "Brockton", "Broken Arrow",#{' '}
                                     "Brookfield", "Brooklyn Park", "Broomfield",#{' '}
                                     "Brownsville", "Bryan", "Buckeye",#{' '}
                                     "Buena Park", "Buffalo", "Buffalo Grove",#{' '}
                                     "Bullhead City", "Burbank", "Burien",#{' '}
                                     "Burleson", "Burlington", "Burnsville",#{' '}
                                     "Caldwell", "Calexico", "Calumet City",#{' '}
                                     "Camarillo", "Cambridge", "Camden",#{' '}
                                     "Campbell", "Canton", "Cape Coral",#{' '}
                                     "Cape Girardeau", "Carlsbad", "Carmel",#{' '}
                                     "Carol Stream", "Carpentersville", "Carrollton",#{' '}
                                     "Carson", "Carson City", "Cary", "Casa Grande",#{' '}
                                     "Casper", "Castle Rock", "Cathedral City",#{' '}
                                     "Cedar Falls", "Cedar Hill", "Cedar Park",#{' '}
                                     "Cedar Rapids", "Centennial", "Ceres",#{' '}
                                     "Cerritos", "Champaign", "Chandler",#{' '}
                                     "Chapel Hill", "Charleston", "Charlotte",#{' '}
                                     "Charlottesville", "Chattanooga", "Chelsea",#{' '}
                                     "Chesapeake", "Chesterfield", "Cheyenne",#{' '}
                                     "Chicago", "Chico", "Chicopee", "Chino",#{' '}
                                     "Chino Hills", "Chula Vista", "Cicero",#{' '}
                                     "Cincinnati", "Citrus Heights", "Clarksville",#{' '}
                                     "Clearwater", "Cleveland", "Cleveland Heights",#{' '}
                                     "Clifton", "Clovis", "Coachella", "Coconut Creek",#{' '}
                                     "Coeur d'Alene", "College Station", "Collierville",#{' '}
                                     "Colorado Springs", "Colton", "Columbia",#{' '}
                                     "Columbus", "Commerce City", "Compton",#{' '}
                                     "Concord", "Conroe", "Conway", "Coon Rapids",#{' '}
                                     "Coppell", "Coral Gables", "Coral Springs",#{' '}
                                     "Corona", "Corpus Christi", "Corvallis",#{' '}
                                     "Costa Mesa", "Council Bluffs", "Covina",#{' '}
                                     "Covington", "Cranston", "Crystal Lake",#{' '}
                                     "Culver City", "Cupertino", "Cutler Bay",#{' '}
                                     "Cuyahoga Falls", "Cypress", "Dallas",#{' '}
                                     "Daly City", "Danbury", "Danville",#{' '}
                                     "Davenport", "Davie", "Davis",#{' '}
                                     "Dayton", "Daytona Beach", "DeKalb",#{' '}
                                     "DeSoto", "Dearborn", "Dearborn Heights",#{' '}
                                     "Decatur", "Deerfield Beach", "Delano",#{' '}
                                     "Delray Beach", "Deltona", "Denton",#{' '}
                                     "Denver", "Des Moines", "Des Plaines",#{' '}
                                     "Detroit", "Diamond Bar", "Doral",#{' '}
                                     "Dothan", "Dover", "Downers Grove",#{' '}
                                     "Downey", "Draper", "Dublin", "Dubuque",#{' '}
                                     "Duluth", "Duncanville", "Dunwoody",#{' '}
                                     "Durham", "Eagan", "East Lansing",#{' '}
                                     "East Orange", "East Providence",#{' '}
                                     "Eastvale", "Eau Claire", "Eden Prairie",#{' '}
                                     "Edina", "Edinburg", "Edmond", "Edmonds",#{' '}
                                     "El Cajon", "El Centro", "El Monte",#{' '}
                                     "El Paso", "Elgin", "Elizabeth",#{' '}
                                     "Elk Grove", "Elkhart", "Elmhurst",#{' '}
                                     "Elyria", "Encinitas", "Enid", "Erie",#{' '}
                                     "Escondido", "Euclid", "Eugene",#{' '}
                                     "Euless", "Evanston", "Evansville",#{' '}
                                     "Everett", "Fairfield", "Fall River",#{' '}
                                     "Fargo", "Farmington", "Farmington Hills",#{' '}
                                     "Fayetteville", "Federal Way", "Findlay",#{' '}
                                     "Fishers", "Fitchburg", "Flagstaff",#{' '}
                                     "Flint", "Florence", "Florissant",#{' '}
                                     "Flower Mound", "Folsom", "Fond du Lac",#{' '}
                                     "Fontana", "Fort Collins", "Fort Lauderdale",#{' '}
                                     "Fort Myers", "Fort Pierce", "Fort Smith",#{' '}
                                     "Fort Wayne", "Fort Worth", "Fountain Valley",#{' '}
                                     "Franklin", "Frederick", "Freeport",#{' '}
                                     "Fremont", "Fresno", "Friendswood",#{' '}
                                     "Frisco", "Fullerton", "Gadsden",#{' '}
                                     "Gainesville", "Gaithersburg", "Galveston",#{' '}
                                     "Garden Grove", "Gardena", "Garland",#{' '}
                                     "Gastonia", "Gilbert", "Gilroy",#{' '}
                                     "Glendale", "Grand Prairie", "Grand Rapids",#{' '}
                                     "Grand Island", "Grand Junction", "Grants Pass",#{' '}
                                     "Green Bay", "Greenwood", "Gresham",#{' '}
                                     "Gulfport", "Hagerstown", "Halifax",#{' '}
                                     "Hamilton", "Hammond", "Harrisburg",#{' '}
                                     "Hartford", "Hayward", "Henderson",#{' '}
                                     "Hialeah", "High Point", "Highland",#{' '}
                                     "Hollywood", "Holly Springs", "Honolulu",#{' '}
                                     "Hoover", "Hopewell", "Houston",#{' '}
                                     "Huntington Beach", "Huntington Station",#{' '}
                                     "Huntsville", "Indianapolis", "Inglewood",#{' '}
                                     "Iowa City", "Irving", "Isla Vista",#{' '}
                                     "Jackson", "Jacksonville", "Janesville",#{' '}
                                     "Jersey City", "Joplin", "Kalamazoo",#{' '}
                                     "Kansas City", "Kenner", "Killeen",#{' '}
                                     "Kingston", "Knoxville", "Lacey",#{' '}
                                     "Lake Charles", "Lake Forest", "Lake Havasu City",#{' '}
                                     "Lakewood", "Lancaster", "Lansing",#{' '}
                                     "Laredo", "Las Cruces", "Las Vegas",#{' '}
                                     "Lasalle", "Lawrence", "Layton",#{' '}
                                     "League City", "Lee's Summit", "Lewisville",#{' '}
                                     "Lexington", "Lincoln", "Little Rock",#{' '}
                                     "Littleton", "Livermore", "Livonia",#{' '}
                                     "Lodi", "Long Beach", "Longview",#{' '}
                                     "Lorain", "Los Angeles", "Louisville",#{' '}
                                     "Lowell", "Lubbock", "Lufkin",#{' '}
                                     "Lumberton", "Lynn", "Macon",#{' '}
                                     "Madison", "Malden", "Malibu",#{' '}
                                     "Mansfield", "Marietta", "Marina",#{' '}
                                     "Marlborough", "Marysville", "McAllen",#{' '}
                                     "McKinney", "Medford", "Melbourne",#{' '}
                                     "Menifee", "Meridian", "Mesquite",#{' '}
                                     "Miami", "Miami Beach", "Midland",#{' '}
                                     "Milford", "Milpitas", "Minneapolis",#{' '}
                                     "Miramar", "Mission Viejo", "Mobile",#{' '}
                                     "Modesto", "Monroe", "Montgomery",#{' '}
                                     "Moreno Valley", "Morgan Hill",#{' '}
                                     "Mount Pleasant", "Murrieta",#{' '}
                                     "Muskegon", "Naperville", "Naples",#{' '}
                                     "Nashua", "Nashville", "New Bedford",#{' '}
                                     "New Britain", "New Brunswick", "New Haven",#{' '}
                                     "New London", "New Orleans", "Newark",#{' '}
                                     "Newcastle", "Newport News", "Norfolk",#{' '}
                                     "North Charleston", "North Las Vegas",#{' '}
                                     "North Little Rock", "North Miami",#{' '}
                                     "North Port", "North Richland Hills",#{' '}
                                     "North Tonawanda", "Norwalk", "Novato",#{' '}
                                     "O'Fallon", "Oakland", "Oceanside",#{' '}
                                     "Odessa", "Ogden", "Oklahoma City",#{' '}
                                     "Olathe", "Olympia", "Ontario",#{' '}
                                     "Orlando", "Overland Park", "Oxnard",#{' '}
                                     "Pacoima", "Palm Bay", "Palm Coast",#{' '}
                                     "Palm Desert", "Palm Springs",#{' '}
                                     "Palmdale", "Panama City", "Parker",#{' '}
                                     "Pasadena", "Paterson", "Pawtucket",#{' '}
                                     "Peabody", "Pearland", "Pembroke Pines",#{' '}
                                     "Pennsauken", "Peoria", "Perris",#{' '}
                                     "Pharr", "Phoenix", "Pittsburgh",#{' '}
                                     "Pittsburg", "Plainfield", "Plano",#{' '}
                                     "Pomona", "Pompano Beach", "Port Arthur",#{' '}
                                     "Port Orange", "Portland", "Poughkeepsie",#{' '}
                                     "Providence", "Pueblo", "Punta Gorda",#{' '}
                                     "Quincy", "Racine", "Radnor",#{' '}
                                     "Raleigh", "Rancho Cucamonga",#{' '}
                                     "Rancho Mirage", "Rancho Palos Verdes",#{' '}
                                     "Reno", "Richmond", "Ridgewood",#{' '}
                                     "Riverside", "Riverton", "Roanoke",#{' '}
                                     "Rochester", "Rock Hill", "Rocklin",#{' '}
                                     "Rockville", "Rogers", "Round Rock",#{' '}
                                     "Rowlett", "Royal Oak", "Sacramento",#{' '}
                                     "Saginaw", "Salem", "Salinas",#{' '}
                                     "Salt Lake City", "San Antonio",#{' '}
                                     "San Bernardino", "San Diego",#{' '}
                                     "San Francisco", "San Gabriel",#{' '}
                                     "San Jose", "San Leandro",#{' '}
                                     "San Luis Obispo", "San Mateo",#{' '}
                                     "San Rafael", "San Ramon",#{' '}
                                     "Santa Ana", "Santa Barbara",#{' '}
                                     "Santa Clara", "Santa Clarita",#{' '}
                                     "Santa Cruz", "Santa Maria",#{' '}
                                     "Santa Monica", "Saratoga Springs",#{' '}
                                     "Savannah", "Scottsdale", "Seattle",#{' '}
                                     "Shreveport", "Simi Valley",#{' '}
                                     "Sioux City", "Sioux Falls",#{' '}
                                     "South Bend", "South Gate",#{' '}
                                     "South Portland", "Southfield",#{' '}
                                     "Southlake", "Southaven",#{' '}
                                     "Southwest Ranches", "Springdale",#{' '}
                                     "Springfield", "St. Charles",#{' '}
                                     "St. Cloud", "St. Louis",#{' '}
                                     "St. Petersburg", "Stamford",#{' '}
                                     "Sterling Heights", "Stockton",#{' '}
                                     "Stonecrest", "Sunnyvale",#{' '}
                                     "Surprise", "Syracuse", "Tacoma",#{' '}
                                     "Tallahassee", "Tampa", "Temecula",#{' '}
                                     "Tempe", "Texas City", "Thousand Oaks",#{' '}
                                     "Toledo", "Topeka", "Torrance",#{' '}
                                     "Trenton", "Tucson", "Tulsa",#{' '}
                                     "Tuscaloosa", "Tyler", "Union City",#{' '}
                                     "Uniondale", "University City",#{' '}
                                     "Upper Arlington", "Upland",#{' '}
                                     "Vacaville", "Vallejo", "Vancouver",#{' '}
                                     "Vero Beach", "Victorville",#{' '}
                                     "Virginia Beach", "Visalia", "Vista",#{' '}
                                     "Waco", "Wakefield", "Waldorf",#{' '}
                                     "Walnut Creek", "Warren", "Washington",#{' '}
                                     "Waterbury", "Waterloo", "Waukegan",#{' '}
                                     "West Allis", "West Babylon",#{' '}
                                     "West Bountiful", "West Covina",#{' '}
                                     "West Des Moines", "West New York",#{' '}
                                     "West Palm Beach", "Westminster",#{' '}
                                     "Weston", "Wheaton", "White Plains",#{' '}
                                     "Wichita", "Wilmington", "Wilson",#{' '}
                                     "Winchester", "Winter Haven",#{' '}
                                     "Winter Park", "Winston-Salem",#{' '}
                                     "Worcester", "York", "Yuba City", "Yuma"
                                   ],
                                   "type": "string"
                                 },
                                 "zipCode": {
                                   "title": "Zip Code",
                                   "description": "Enter your zip code.",
                                   "type": "string"
                                 },
                                 "interest": {
                                   "title": "Interest",
                                   "type": "string",
                                   "enum": [
                                     "Acting", "Art", "Basketball", "Boxing",#{' '}
                                     "Cooking", "Dancing", "Darts", "Fashion",#{' '}
                                     "Fitness", "Gaming", "Guitar", "Hiking",#{' '}
                                     "Music", "Painting", "Photography",#{' '}
                                     "Reading", "Singing", "Soccer", "Surfing",#{' '}
                                     "Swimming", "Theater", "Traveling",#{' '}
                                     "Writing"
                                   ]
                                 },
                                 "description": {
                                   "title": "Description",
                                   "type": "string",
                                   "description": "Please describe your talents and interests."
                                 },
                                 "photo": {
                                   "title": "Photo Upload",
                                   "type": "string",
                                   "format": "uri",
                                   "description": "Upload a photo. Supported formats: jpg, png, gif."
                                 }
                               }
                             },
                             "type": "object",
                             "title": "Talent Form"
                           }
                         JSON
                        )

    @event = Event.create!(title: 'test_events', producer_id: @admin._id.to_str, status: 'ACCEPTING',
                           form_id: @form._id.to_str)

    @auth_talent = Auth.create!(name: 'eventtest_user', email: 'eventtest_user@gmail.com', password: '12345678',
                                user_type: 'USER')
    @talent = Talent.create!(name: 'eventtest_user', email: 'eventtest_user@gmail.com')

    @auth_client = Auth.create!(name: 'eventtest_client', email: 'eventtest_client@gmail.com', password: '12345678',
                                user_type: 'CLIENT')
    @client = Client.create!(name: 'eventtest_client', email: 'eventtest_client@gmail.com')

    @slide = Slide.create(
      event_id: @event._id,
      talent_id: @talent._id,
      curated: false,
      submission_status: 'UNDER REVIEW',
      data: {
        name: 'aaaa',
        email: 'aaaa@gmail.com',
        talentName: 'aaaa',
        state: 'Kentucky',
        city: 'Ames',
        paymentLink: 'paypal.me/random'
      }.to_json
    )

    @client.update(slide_ids: [@slide._id])
    @event.update(slide_ids: [@slide._id])
    @negotiation = Negotiation.create(event_id: @event._id, client_id: @client._id,
                                      intermediateSlides: [@slide._id.to_str])
    @comment = Comment.create(slide_id: @slide._id, client_id: @client._id, content: 'hahaaha', owner: @client.name)
  end
  describe 'events#show' do
    it 'should not show if no session' do
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :show, params: { id: @event._id.to_str }
      expect(response).to have_http_status(:redirect)
    end
    it 'should show if session is admin' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :show, params: { id: @event._id.to_str }
      expect(response).to have_http_status(:success)
    end
    it 'should  show if client  assigned ' do
      session[:userType] = 'CLIENT'
      session[:userName] = 'eventtest_client'
      session[:userEmail] = 'eventtest_client@gmail.com'
      session[:userId] = @client._id.to_str
      get :show, params: { id: @event._id.to_str }
      expect(response).to have_http_status(:success)
    end
    it 'should show if session is user' do
      session[:userType] = 'USER'
      session[:userName] = 'eventtest_user'
      session[:userEmail] = 'eventtest_user@gmail.com'
      session[:userId] = @talent._id.to_str
      get :show, params: { id: @event._id.to_str }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'events#new' do
    it 'should get a new event page' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :new
      expect(response).to have_http_status(:success)
    end
    it 'should not get a new event page' do
      session[:userType] = 'CLIENT'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :new
      expect(response).to have_http_status(:redirect)
    end
  end
  describe 'events#post' do
    it 'should create a new event' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      post :create,
           params: {
             form_id: @form._id,
             title: 'event create',
             description: 'event description',
             location: 'Houston',
             statename: 'Texas',
             eventdate: '2023-11-30T06:00:00.000Z',
             category: 'Fashion',
             is_paid_event: 'No'
           }

      expect(response).to have_http_status(:success)
    end
    it 'should not create a new event' do
      session[:userType] = 'USER'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      post :create,
           params: { form_id: @form._id, title: 'event create', description: 'event description', location: 'Houston',
                     statename: 'Texas', eventdate: '2023-11-30T06:00:00.000Z', category: 'Fashion', is_paid_event: 'No' }
      expect(response).to_not have_http_status(:success)
    end
  end
  describe 'event#edit' do
    it 'should get a edit event page' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :edit, params: { id: @event._id }
      expect(response).to have_http_status(:success)
    end
    it 'should not get a edit event page' do
      session[:userType] = 'USER'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      get :edit, params: { id: @event._id }
      expect(response).to_not have_http_status(:success)
    end
  end
  describe 'event#update' do
    it 'should update the event status' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      put :update, params: { id: @event._id, status: 'DELETED' }
      expect(response).to have_http_status(:success)
    end
    it 'should update the event info' do
      session[:userType] = 'ADMIN'
      session[:userName] = 'eventtest'
      session[:userEmail] = 'eventest@gmail.com'
      session[:userId] = @admin._id.to_str
      put :update, params: { id: @event._id, description: 'event description modified' }
      expect(response).to have_http_status(:success)
    end
  end
end
