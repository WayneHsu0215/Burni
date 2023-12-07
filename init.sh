#!/bin/bash

# Path to the Dockerfile
DOCKERFILE_PATH="./Dockerfile"

# Read the Dockerfile and modify the specified line
awk '{
    if (NR == 4) {
        print "RUN apt update && apt install openjdk-11-jdk-headless make g++ python3 netcat curl iputils-ping -y"
    } else {
        print $0
    }
}' $DOCKERFILE_PATH > temp_dockerfile && mv temp_dockerfile $DOCKERFILE_PATH

# Indicate completion
echo "Dockerfile updated successfully"

ENV_TEMPLATE="./.env.template"
ENV_FILE="./.env"

# Check if .env file already exists
if [ ! -f "$ENV_FILE" ]; then
    # Check if the template file exists
    if [ -f "$ENV_TEMPLATE" ]; then
        # Copy the template to create the .env file
        cp "$ENV_TEMPLATE" "$ENV_FILE"
        echo ".env file created successfully from template."
    else
        echo "Template file $ENV_TEMPLATE does not exist. Cannot create .env file."
        exit 1
    fi
else
    echo ".env file already exists, skipping creation."
fi

# Function to copy config template if config.js doesn't exist
copy_config_if_not_exists() {
    local template="$1/config.template.js"
    local config="$1/config.js"

    if [ ! -f "$config" ]; then
        cp "$template" "$config"
        echo "Created config.js in $1"
    else
        echo "config.js already exists in $1, skipping."
    fi
}

# Apply the function to both config and plugins directories
cd config
copy_config_if_not_exists .
npm install
npm install lodash
node generate-config-allResources.js
npm run build

cd ../plugins
copy_config_if_not_exists .
echo done


