// check env.
// var env = process.env.NODE_ENV || 'development';
// fetch env. config
// var config = require('./config.json');
// var envConfig = config[env];
// add env. config values to process.env
// Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);

process.env["MONGODB_URI"] = "mongodb+srv://ashiqcv:19851055181@cluster0.lkvm8.mongodb.net/oldschool?retryWrites=true&w=majority";
process.env["JWT_SECRET"] = "OLDSCHOOLSECRET";
process.env["JWT_EXP"] = "2 days";
// {
//     "development" : {
//         "PORT" : 3000,
//         "MONGODB_URI" : "mongodb://localhost:27017/oldschool",
//         "JWT_SECRET": "OLDSCHOOLSECRET",
//         "JWT_EXP": "2 days"
//     },
//     "production" : {
//         "PORT" : 80,
//         "MONGODB_URI" : "mongodb+srv://ashiqcv:19851055181@cluster0.lkvm8.mongodb.net/oldschool?retryWrites=true&w=majority",
//         "JWT_SECRET": "OLDSCHOOLSECRET",
//         "JWT_EXP": "2 days"
//     }
// }