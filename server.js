const express = require('Express');
const app = express();

app.get('/', (req,res) => res.send('API running'));

//PORT will look the environment variable called port . when deploy app in heroku so that's it will get port number 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 

console.log(`Server is start on the Port ${PORT}`));