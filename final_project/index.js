const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const username = req.body.username;
const password = req.body.password;

if(!username || !password){
    console.log(" username et/ou password absent")
    res.send('veiller saisir un username et un password valid')
    req.next();
}
//utilisateur authentifier
if(authenticated(username, password)){


const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});

// stocker le accessToken et nom d'utiisateur dans la session

req.session.authorization = {accessToken, username}
    return res.status(200).send('utilisateur connecte avec succes')
}else{
    return res.status(300).json({message:'utilisateur non connecter'})
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
