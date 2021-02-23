FROM lambci/lambda:build-nodejs12.x

RUN npm install -g serverless yarn sharp

CMD ['bin/bash']