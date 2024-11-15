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

For Jest and Cucumber tests, run
```
 yarn test --coverage
```
For Rspec tests, run
```
bundle exec rspec
```