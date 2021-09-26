const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    const body = [];

    // if there is ever an error, these lines get called
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      responseHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/') responseHandler.getIndex(request, response);
  else if (parsedURL.pathname === '/style.css') responseHandler.getStyle(request, response);
  else if (parsedURL.pathname === '/getUsers') responseHandler.getUsers(request, response);
  else if (parsedURL.pathname === '/notReal') responseHandler.notReal(request, response);
  else responseHandler.notFound(request, response);
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url); // Turns URL into readable JSON

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else {
    handleGet(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
