FROM ruby:2.6.6

WORKDIR /home
COPY Gemfile package.json yarn.lock ./

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 
RUN apt-get install -y nodejs

RUN npm install -g yarn

RUN gem install bundler -v 2.2.31
RUN bundle config set force_ruby_platform true
RUN bundle install

COPY . .
COPY config/mongoid.Docker.config config/mongoid.yml
RUN yarn install

RUN ./bin/webpack

RUN rm -rf tmp/

CMD rails s -b 0.0.0.0 -p 3000
