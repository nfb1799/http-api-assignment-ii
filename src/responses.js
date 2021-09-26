const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getUsers = (request, response) => {
    if(request.method === 'GET') {
        respondJSON(request, response, 200, users);
    } else if(request.method === 'HEAD') {
        respondJSONMeta(request, response, 200);
    }
};

const notReal = (request, response) => {
    if(request.method === 'GET') notFound(request, response);
    else if(request.method === 'HEAD') respondJSONMeta(request, response, 404);
};

const addUser = (request, response, body) => {
    const responseJSON = {
        message: 'Name and age are both required',
    };

    if(!body.name || !body.age) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    //ensures that body.name exists in users
    if(users[body.name]) responseCode = 204;
    else users[body.name] = {};

    users[body.name].name = body.name;
    users[body.name].age = body.age;

    if(responseCode === 201){
        responseJSON.message = 'Created Successfully!';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
    const content = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    return respondJSON(request, response, 404, content);
};

module.exports = {
  getIndex,
  getStyle,
  getUsers,
  addUser,
  notReal,
  notFound
};
