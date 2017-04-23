var prompt = require('prompt-sync')();
var fs = require('fs');
var exec = require('child_process').exec;

init();

function init() {
  var dotenv = prompt("Create a .env file? [Y/N]: ");
  if ((dotenv === 'Y') || (dotenv === 'y')) {
    createDotEnv();
  } else {
    console.log("Skipping .env file.")
  }

  var database = prompt("\nInitialize with template database? [Y/N]: ");
  if ((database === 'Y') || (database === 'y')) {
    console.log("Creating a new database.");
    initializeDatabase();
  } else {
    console.log("Skipping database creation.")
  }
}

function initializeDatabase() {
  console.log("\n[ Initializing Template Database ]\n");
  exec ('mongodump');
  exec ('mongorestore init_db');
}

function createDotEnv() {
  console.log("\n[ Creating New .env File ]");
  var AUTH0_DOMAIN = prompt("Auth0 Domain (e.g. domainname.auth0.com): ");
  var AUTH0_CLIENT_ID = prompt("Auth0 Client ID: ");
  var AUTH0_CLIENT_SECRET = prompt("Auth0 Client Secret: ");
  var AUTH0_CALLBACK_URL = prompt("Auth0 Callback URL (e.g. website.url:port/callback): ");
  var DATABASE_SERVER = prompt("Database Server (e.g. localhost): ");
  var DATABASE_NAME = prompt("Database Name (e.g. Eucalyptus): ");
  var HTTP_PORT = prompt("Web Server Port (e.g. 8001): ");

  var stream = fs.createWriteStream(".env");
  stream.once('open', function(fd) {
    stream.write("AUTH0_DOMAIN=" + AUTH0_DOMAIN + "\n");
    stream.write("AUTH0_CLIENT_ID=" + AUTH0_CLIENT_ID + "\n");
    stream.write("AUTH0_CLIENT_SECRET=" + AUTH0_CLIENT_SECRET + "\n");
    stream.write("AUTH0_CALLBACK_URL=" + AUTH0_CALLBACK_URL + "\n");
    stream.write("DATABASE_SERVER=" + DATABASE_SERVER + "\n");
    stream.write("DATABASE_NAME=" + DATABASE_NAME + "\n");
    stream.write("HTTP_PORT=" + HTTP_PORT + "\n");
    stream.end();
  });
}
