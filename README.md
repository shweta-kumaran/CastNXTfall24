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
1. Setup the application locally (without docker compose)
2. Create an admin with email: `admin@example.com` and password: `123456qt`
3. Create an event:

| Event title | Event description | Date | State | Location | Category | Paid |
|--------|--------|--------|--------|--------|--------|--------|
| Miu Miu | Miu Miu showcase  | 2024-12-19 | New York | Albany   | Fashion  | Yes  |
4. Run 
```
yarn test spec/features
```
5. If you face timeout errors, run `rails webpacker:install && rails webpacker:compile` before running this test.

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
Harsh Manishkumar Shah <shahharsh06@tamu.edu>,
Rahul Baid <rahulbaid@tamu.edu>,
Jose Salazar <jlsalazar@tamu.edu>,
Shweta Kumaran <shwetakumaran@tamu.edu>

