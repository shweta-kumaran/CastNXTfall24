FROM ruby:2.6.6

WORKDIR /home
COPY Gemfile package.json ./

ENV RAILS_ENV=development

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs

RUN npm install -g npm@10.8.2
# RUN npm install -g n
# RUN n 16.13.0
# RUN hash -r
RUN npm install -g yarn

RUN gem install bundler -v 2.2.31
RUN bundle config set force_ruby_platform true
RUN bundle install

COPY . .
COPY config/mongoid.Docker.config config/mongoid.yml
RUN npm install

RUN rails webpacker:install
RUN rails webpacker:compile

RUN rm -rf tmp/

CMD rails s -b 0.0.0.0 -p 3000
