# CastNxt Fall 2024

**Fall 2024 FashioNXT-CastNXT Heroku App**:  https://castnxtfall2024-a6422e600193.herokuapp.com/ 

**Fall 2024 FashioNXT-CastNXT Code Climate Report**: https://codeclimate.com/github/shweta-kumaran/CastNXTfall24

**Fall 2024 FashionNXT-CastNXT Github Project**: https://github.com/users/shweta-kumaran/projects/2

**Fall 2024 CastNXT Team Working Agreement**: [TWA.md](./TWA.md)

## Developer Guide

Clone -> Go to directory with CASTNXT project

### Without docker compose

1. Install Ruby version `2.6.6`. You could use `rbenv`, `rvm`, `brew` (for macOS). Use the same installation mechanism you used to install Ruby earlier.
2. Run `gem install bundler -v 2.4.22`
3. Run `bundle install`
4. Run `yarn install`
5. Run a mongoDB instance. There are multiple ways to do this, but the simplest one would be to use `docker`.
```sh
docker run --rm -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example -v data:/data/db mongo:8.0.0
```
6. In a separate terminal window, run `./bin/webpack-dev-server`
7. In a separate terminal window, run `rails s`.
8. That's it, just navigate to `http://localhost:3000/` in your browser.

### With docker compose
Run `docker compose up` and navigate to `http://localhost:3000/` in your browser.

### Running Testcase in Local
#### For Rspec tests, run
```
bundle exec rspec
```

#### For Jest tests, 
1. Setup the application locally (without docker compose)
2. Run
```
 yarn coverage spec/javascript
```

#### For Cucumber tests,
### For Admin:
1. Setup the application locally (without docker compose)
2. Create an admin with email: `admin@example.com` and password: `123456qt`
3. Create an event:
| Event title | Event description | Date | State | Location | Category | Paid |
|--------|--------|--------|--------|--------|--------|--------|
| Miu Miu | Miu Miu showcase  | 2024-12-19 | New York | Albany   | Fashion  | Yes  |
4. Log out from the Admin account.

### For User:
1. Setup the application locally (without docker compose)
2. Create an admin with email: `user@example.com` and password: `123456qt`
3. Go to the event named `Miu Miu` and click to register for the event with the created user.
4. Click Submit to complete the registration for the event `Miu Miu`

### For Client:
1. Setup the application locally (without docker compose)
2. Create an admin with email: `client@example.com` and password: `client123`

### Additional Steps:
1. Log in as Admin.
2. Navigate to the event named `Miu Miu`.
3. Click Submitted Docs, where you'll find the user created earlier.
4. Click on the username, scroll down to the bottom of the page.
5. Locate the Select option on the right and click it.
6. Move to the next tab named Selected Docs.
7. Select the username again, scroll down to the Clients section, and choose the client name created earlier from the dropdown.
8. Click Update to save the changes
9. Log out from the Admin account.

Now the setup is ready to proceed with the Cucumber Scenarios.

To Run all tests:
```
yarn test spec
```
or Run the tests using:
```
yarn test spec/features
```
If you face timeout errors, run `rails webpacker:install && rails webpacker:compile` before running this test.

### Deployment
This application uses the following components:

Backend
* Ruby v2.6
* Rails v5.2

Frontend
* React v17.0
* Material UI v4.12

Database
* MongoDB

This application is deployed to Heroku using [Github Actions](.github/workflows/deploy.yaml) under the FashioNxt account.

You should have the following env vars in Heroku :

![image](https://github.com/user-attachments/assets/04fda194-90da-4618-b304-0d2cf7b873b3)

### Team contacts :
Rituparna Mandal <rituparna@tamu.edu>,
Alea Nablan	<alean@tamu.edu>,
Rahul Baid <rahulbaid@tamu.edu>,
Jose Salazar <jlsalazar@tamu.edu>,
Shweta Kumaran <shwetakumaran@tamu.edu>,
Harsh Manishkumar Shah <shahharsh06@tamu.edu>.
