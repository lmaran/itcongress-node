'use strict';

// Development specific configuration
module.exports = {
    port: 1410,
    mongo: {
        uri: 'mongodb://localhost/itcongress-dev'
    },
    // mailgun: {
    //     api_key: 'key-ddfa5b01ca4cac91541645448bcdef14'
    // }, 
    zoho: {
        user: 'support@celebrate-taste.ro',
        psw: 'Aa123456'
    },          
    gaCode: 'UA-72165579-1',
    externalUrl: 'http://localhost:1410',
    roUtcOffset: 0 // stg/prod => userTime=srvTime + 2,  dev => userTime=srvTime
};
