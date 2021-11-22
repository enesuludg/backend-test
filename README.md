# backend-test
Nodejs/Express-MongoDB App with Docker

# swagger
http://localhost:3000/api-docs/#/

# Run
$docker-compose up
# singup
post localhost:3000/singup
{email:email,password:password}
response => verify link

# login 
## !You must click on verify link to login
post localhost:3000/login
{email:email,password:password}
