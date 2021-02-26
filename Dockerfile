FROM lambci/lambda:build-nodejs12.x

RUN npm install -g serverless node-jq

CMD ['bin/bash']