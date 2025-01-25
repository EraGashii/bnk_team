# bnk




## User Data


ON THE /bnk/server/ PATH , RUN : 

```
npx sequelize-cli db:seed:all

```

In order to automatically insert the User data to the database.
NOTE: Make sure you create a config/config.json file first and fill your MySql credentials. The config.json file should look like this : 

```

{
  "development": {
    "username": "YOURUSERNAME",
    "password": "YOURPASSWORD",
    "database": "DATABASE_NAME",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
