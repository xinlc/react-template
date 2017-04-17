rm -rf dist/*
npm run dist
scp -r dist/* www@w3.cyqapp.com:/data/wwwroot/cybwebapp/
