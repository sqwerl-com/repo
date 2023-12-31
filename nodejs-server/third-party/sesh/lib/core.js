var sessions = require('./session'),
    response = require('response'),
    http     = require('http');

exports.session = function( request, response, callback ){
 
 
 var session; 
  
  // inspect the current request and determine if we have a session for it 
  // sessions are determined by doing a lookup of request.headers["Set-Cookie"] against our sessions hash
  session = sessions.lookupOrCreate(request,{
    lifetime:604800
  });
  
  // implement a basic history for each session, be mindful of this as it could eat up memory with high usage
//  if(!session.data.history) { session.data.history = []; }
//  session.data.history.push(request.url);

  // as a convention, we will set all non-indentified users to "Guest"
  if(typeof session.data.user == 'undefined' || session.data.user == ""){
    session.data.user = { id: "/types/users/guest", alias: "guest" };
    session.auth = true;
    session.expiration = Number.MAX_VALUE;
  }
  
  // set the response header to set cookie for the current session
  // this is done so the client can pass along cookie information for subsequent requests
  response.setHeader('Set-Cookie',  [[ session.getSetCookieHeaderValue() ], [ session.getSetUserNameCookieHeaderValue() ]]);
 
  // in addition to setting the response object, we will also set a new 
  // property on the request called "session", this is done so we can easily 
  // refer to the session object in other places
  request.session = session;
 
  // fire the callback to continue the request / response processing chain 
  callback( request, response );
  
};

exports.magicSession = function(){

  http.createServer = function (requestListener) {

    // Create a new instance of a node HttpServer
    var orig = new http.Server(function(request, response){

      exports.session(request, response, function(request, response){
        requestListener(request, response);
      });
    });

    // Monkey punch the http server
    var server = Object.create(orig);

    server.listen = function (port) { 
      orig.listen(Number(port)); 
    };

    return server;
  };  

};