#!/bin/bash
# TODO for users: Update PAT and BRANCH_NAME

# Backend Variables
BRANCH_NAME="checkpoint-20230224"
TEMPLATE_BRANCH_NAME="dev_main"
CORE_MODULES_BRANCH_NAME="main"
STOCK_ALGORITHMS_BRANCH_NAME="main"

# Frontend Variables
FRONTEND_APIGW_TAG_NAME="main"
FRONTEND_PORTAL_TAG_NAME="main"
FRONTEND_SHAREDLIB_TAG_NAME="main"
WIDGET_ALGORITHMS_BRANCH_NAME="main"

# User Variables
PAT="glpat-Exq4B8DGEphwkx8JMcd1"
VENV_PATH="./venv"

# if [[ $# -eq 0 ]] ; then
#     echo 'Requires PAT.'
#     exit 1
# fi

### Backend Install the packages and redis ###
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt update
sudo apt install -y python3.10-venv redis

### Frontend Installation ###
# Install curl and git
sudo apt-get update
sudo apt-get install -y curl git python3-pip

# Install nodejs
# Remove and clean up previous installations
sudo dpkg -i --force-overwrite /var/cache/apt/archives/nodejs_18.14.2-deb-1nodesource1_amd64.deb
sudo apt -f install

# Install Nodejs
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Other Dependencies
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi-dev libxtst-dev libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0 libgbm1

# Create a venv
python3 -m venv $VENV_PATH
source $VENV_PATH/bin/activate

# Clone all necessary repositories with specific tags

# Test Engine Algorithm Template
git clone -b $TEMPLATE_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-algo-plugin-template.git

# Test Engine Core Modules Template
git clone -b $TEMPLATE_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules-template.git

# Test Engine Core
git clone -b $BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core.git
pip3 install test-engine-core/dist/test_engine_core-1.0.0.tar.gz

# Test Engine App
git clone -b $BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-app.git
cd test-engine-app/
pip3 install -r requirements.txt

# Create new .env file
echo "CORE_MODULES_FOLDER=\"../core_modules\"
VALIDATION_SCHEMAS_FOLDER=\"$(pwd)/test_engine_app/validation_schemas/\"
REDIS_CONSUMER_GROUP=\"MyGroup\"
REDIS_SERVER_HOSTNAME=\"localhost\"
REDIS_SERVER_PORT=6379" > .env
cd ..

# CORE MODULES
mkdir core_modules
cd core_modules
# Test Engine Core Modules (Serializers)
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/joblibserializer.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/pickleserializer.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/tensorflowserializer.git
# Test Engine Core Modules (Models)
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/lightgbmmodel.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/openapimodel.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/sklearnmodel.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/xgboostmodel.git
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/tensorflowmodel.git
# Test Engine Core Modules (Data)
git clone -b $CORE_MODULES_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-test-engine/test-engine-core-modules/pandasdata.git
# Run command to install all the plugins
find ./ -type f -name 'requirements.txt' -exec pip3 install -r "{}" \;
cd ..

# ALGORITHMS
mkdir algorithms
cd algorithms
git clone -b $STOCK_ALGORITHMS_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/aiverify.stock.algorithms.accumulated_local_effects.git
git clone -b $STOCK_ALGORITHMS_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/aiverify.stock.algorithms.fairness_metrics_toolbox.git
git clone -b $STOCK_ALGORITHMS_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/aiverify.stock.algorithms.partial_dependence_plot.git
git clone -b $STOCK_ALGORITHMS_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/aiverify.stock.algorithms.performance_metrics_toolbox.git
git clone -b $STOCK_ALGORITHMS_BRANCH_NAME https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/aiverify.stock.algorithms.shap_toolbox.git

cd ../

# Frontend
sudo apt-get install -y npm

# Clone all necessary repositories with specific tags
# APIGW
git clone https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-portal/ai-verify-apigw.git --branch=$FRONTEND_APIGW_TAG_NAME
cd ai-verify-apigw/
npm install
cd ../

# API-SHAREDLIB
git clone https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-portal/ai-verify-shared-library.git --branch=$FRONTEND_SHAREDLIB_TAG_NAME
cd ai-verify-shared-library
sudo npm install lerna
sudo npm run build
cd ../

# API-PORTAL
git clone https://oauth2:$PAT@gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-portal/ai-verify-portal.git --branch=$FRONTEND_PORTAL_TAG_NAME
cd ai-verify-portal/
npm install
npm install cytoscape cytoscape-dagre cytoscape-dom-node
sudo npm link ../ai-verify-shared-library
sudo npm install ../ai-verify-shared-library
cd ../

### RUN THE APPLICATION ###
# Setup MongoDB
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
mongod > /dev/null &
sleep 5  #This is to allow mongod to startup properly

# Add a default MongoDB user
mongosh < init_db.js

# Copy redis.conf to replace
sudo cp redis.conf /etc/redis/redis.conf

# Setup Redis Server
sudo service redis-server start

# Run API GW, Portal and App
cd ai-verify-apigw
npm run dev &
cd ..

cd ai-verify-portal
npm run dev &
cd ..

source $VENV_PATH/bin/activate
cd test-engine-app
python3 -m test_engine_app