/* global process */
'use strict';

// Staging specific configuration (declared as "Env. variables" on the remote server)
module.exports = {
    port: process.env.PORT || 1337,
    mongo: {
        uri: process.env.MONGO_URI
    },
    gaCode: 'UA-72165579-2',
    azureStorage: {
        account: process.env.AZURE_STORAGE_ACCOUNT,
        key: process.env.KEY
    }    
};