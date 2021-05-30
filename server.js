const express = require('Express');
const connectDB = require('./config/db')
const app = express();


//connect db
connectDB(); 
app.get('/', (req,res) => res.send('API running'));

//Defines Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

//PORT will look the environment variable called port . when deploy app in heroku so that's it will get port number 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is start on the Port ${PORT}`));