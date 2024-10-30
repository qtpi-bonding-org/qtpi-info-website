# Use the official Ruby image as the base
FROM ruby:latest

COPY . /website

# Set the working directory to /website
WORKDIR /website

# Install necessary packages and gems, then clean up
RUN apt-get update && \
    apt-get install -y build-essential && \
    gem install jekyll bundler && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    bundle install

# Expose the port Jekyll will run on
EXPOSE 4000

# Command to run Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--incremental"]