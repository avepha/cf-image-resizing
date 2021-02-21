FROM lambci/lambda:build-nodejs12.x

RUN npm install -g serverless && npm install -g yarn

CMD ['bin/bash']