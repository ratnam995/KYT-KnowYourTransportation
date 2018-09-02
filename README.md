# KYT-KnowYourTransportation

Steps for running Frontend-:
1) Goto the folder, `KYT-Frontend`.
2) Run command, `npm install`.
3) Run command, `npm start`.


Steps for running Backend-:

Prerequisite- PostGreSQL server must be up and running. Create a database with following config:
                {
                    "database": "ratnam",
                    "host": "127.0.0.1", [localhost]
                    "port": "5432"
                }

1) Goto folder, `KYT-Backend`.
2) Run command, `npm install`.
3) Run command, `npm run sync`. [This command will run sync.js script, that will create required tables in your database with already defined schema].
4) Run command, `npm run fetchJSON`. [This command will run fetchJSON.js script, that will fetch JSON data from the Amazon S-3 presgined url and will write it to a file (public/fetchedData.json)].
5) Run command, `npm run exposeJSON`. [This command will run saveJsonToDB.js script, that will expose and modify fetched data, read from fetchedData.json file. Then it will add the data to corresponding tables].
6) Run command, `npm start`.

Thats all, kudos.