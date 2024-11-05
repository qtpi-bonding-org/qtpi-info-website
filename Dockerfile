# Use the official Ruby image as the base
FROM ruby:3.3-alpine3.20

COPY . /website

# Set the working directory to /website
WORKDIR /website

# Install necessary packages and gems, then clean up
RUN apk update && \
    apk add --no-cache build-base git && \
    gem install jekyll bundler && \
    bundle install

# Expose the port Jekyll will run on
EXPOSE 4000

# Command to run Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--incremental"]