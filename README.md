## Fall 2024 Information

**Fall 2024 FashioNXT-CastNXT Heroku deployment information**:  https://castnxtfall2024-a6422e600193.herokuapp.com/ 

**Fall 2024 FashioNXT-CastNXT Code Climate Report**: https://codeclimate.com/github/shweta-kumaran/CastNXTfall24

**NOTIFICATION(!): All the debugging report, issue report, erratum report for the found and reported mistakes, issues, bugs and many other related issues will 
be reported in the corresponding debugging_report.txt file.** 


**Fall 2024 CastNXT Team**

[**Team Working Agreement**](https://github.com/shweta-kumaran/CastNXTfall24/blob/main/TWA.md)

[**Developer Guide**](/developer-guide.md)


===================================================================================================


## Steps for Local:
Prerequisites: mongodb:[https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/) \
create a mongodb admin user
```
>use admin;
>db.createUser(
  {
    user: "root",
    pwd: "example",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
// The username and password should match the definition in `config/mongoid.yml` 
```

Clone -> Go to directory with CASTNXT project
```
/bin/bash --login
rvm install “ruby-2.6.6”
bundle install
```
```
npm install -g npm@8.5.4
nvm install --lts
npm install -g yarn
```
```
bundle exec rails webpacker:install
```

Then Run your mongodb service (Different platform has different cmd lines)

Finally
```
rails db:migrate RAILS_ENV=development
rails s -p $PORT -b $IP
```
---
## Steps for Heroku:
> Heroku Build takes a lot of space right now.
Upgrade volume to >=15GB.

Clone -> Go to directory with CASTNXT project

### Create heroku project (unnecessary)
```
heroku login -i
heroku container:login
heroku create castnxtfall24
```

### Build repo into container and deploy to heroku
```
heroku container:login
heroku container:push web -a castnxtfall24
heroku container:release web -a castnxtfall24
```

### Tail the logs:
```
heroku logs --tail -a castnxtfall24
```

### executing testcases 
`````````
yarn test --coverage
``````````
