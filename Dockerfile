
ARG RUBY_VERSION=3.3.5
FROM ruby:${RUBY_VERSION}

WORKDIR /home

ENV RAILS_LOG_TO_STDOUT="1" \
    RAILS_SERVE_STATIC_FILES="true" \
    RAILS_ENV="development"

COPY Gemfile Gemfile.lock package.json package-lock.json ./
RUN bundle install

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g npm@10.9.0
RUN npm install -g n
RUN n stable
RUN hash -r
RUN npm install -g yarn@1.22.22

COPY . .
RUN mv config/mongoid.Docker.config config/mongoid.yml

RUN rails webpacker:install
RUN rails webpacker:compile

RUN rm -rf tmp/

CMD rails s -b 0.0.0.0 -p $PORT