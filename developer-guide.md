# Developer Guide

## Without docker compose

1. Install Ruby version `3.3.5`. You could use `rbenv`, `rvm`, `brew` (for macOS). Use the same installation mechanism you used to install Ruby earlier.
2. Run `gem install bundler`
3. Run `bundle install`
4. Run a mongoDB instance. There are multiple ways to do this, but the simplest one would be to use `docker`.
```sh
docker run --rm -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example -v data:/data/db mongo:8.0.0
```
5. In a separate terminal window, run `rails s`.
6. That's it, just navigate to `http://localhost:3000/` in your browser.


## With docker compose
Run `docker compose up`