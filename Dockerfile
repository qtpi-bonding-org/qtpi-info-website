# Use the official Ruby image as the base
FROM ruby:latest

# Install necessary packages and gems
RUN apt-get update && \
    apt-get install -y build-essential && \
    gem install jekyll bundler

# Copy the content of the website directory into the container
COPY website /

# Set the working directory to /website
WORKDIR /website

# Install gems from Gemfile
RUN bundle install

# Expose the port Jekyll will run on
EXPOSE 4000

# Command to run Jekyll server
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--incremental"]
