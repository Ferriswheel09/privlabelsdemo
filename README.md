## Setting up Elasstic Search and Kibana Docker Compose Setup

Cone this repo to the location you want to run elastic search and kibana

1. Bring up the service

   ```
   docker compose up -d
   ```

2. Reset elastic search password (save this!)

   ```
   docker compose exec elasticsearch /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
   ```

   Put this in the `.env` file so that you can use it later across different scripts

3. Generate a kibana access token 

   ```
   docker compose  exec elasticsearch /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
   ```
   
4. Go to http://locahost:5601 and paste in the enrollment token (don't need https)

5. You'll be prompted for a verification code, which you can get via (Note in last test this wasn't necessary)


   ```
   docker compose exec kibana bin/kibana-verification-code
   ```

6. Log into Kimbana with username `elastic` and the password from step 2

## Setting up express and nodejs

1. Install modules

    ```
    npm install
    ```

2. To run

    ```
    npm start
    ```

3. Where to edit? Look at `index.js`


## nodejs for elastic

For the client, you'll need to get the SSH certificate fingerprint out of the docker instance

```
docker compose exec elasticsearch openssl x509 -fingerprint -sha256 -in config/certs/http_ca.crt | head -1
```

Past that into the connect command in js

```js
const client = new Client({
    node: 'https://localhost:9200', // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    caFingerprint: 'CA:AD:57:...',
    tls: {    
        rejectUnauthorized: false
    }
});
```

## VSCode testing elastic

1. Install "Elastic Search for VScode"

2. Create a file `query.es` (or any file ending in `.es`) 

3. You can then run the queries from with vscode

## VScode httpBook

1. Install "httpBook" extension

2. Create a file `test.http` 

3. Add various test rest commands, like below

    ```
    POST http://localhost:3000/api/search/app_id HTTP/1.1

    content-type: application/json
    {
        "app_id": "1542367205"    
    }
    ```

4. Run them and see results. 

## Notes about setting up elastic

Unless we want to set up replicas of our data, we should set the number of replicas to 0.

However, down the line, we probably want to attach replicas

## React Remix

I think we should probably use React Remix as it will cleanly integrate loading of page content.

It has this nice loader feature https://remix.run/docs/en/main/route/loader which will make it easy to integrate with elasticsearch backend

We can create a page like privlabelobsv.org/app/app_id that will rout to always load the page for a given app_id and we can go further by making it privlabelobsv.org/app/app_id/run_id to show it at a given run and so on.


Do this tutorial, but substitute

https://remix.run/docs/en/main/start/tutorial#setup

CSS ideas -- bootstraps 