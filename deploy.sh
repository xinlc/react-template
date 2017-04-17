rm -rf dist/*
npm run dist
scp -r dist/* www@ec1:/data/wwwroot/cybwebapp/
scp -r dist/* www@ec2:/data/wwwroot/cybwebapp/
