const express = require('express');
const app = express();
const path = require('path');   //for ejs
const mongoose = require('mongoose'); 
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground'); //to import schema from this location


mongoose.connect('mongodb://127.0.0.1:27017/Manco', { 
     useNewUrlParser: true,
     useUnifiedTopology: true,    
    })
.then (() => {     
   console.log(' DataBase connected to Manco')
})
.catch(err => {
    console.log('Connection Error!!!!!!!!!!')
    console.log(err)
    }) ;

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 25) + 10;
        const camp = new Campground({
            author: '6405e545d819215ae1fa5b89',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias quidem reiciendis consectetur velit eos perspiciatis sequi quas nulla. Minima ipsa corporis rerum et quae, delectus ex nam quam aliquid veritatis.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                 ]
            },
            images:  [
                {
                  url: 'https://res.cloudinary.com/dk6pstm5m/image/upload/v1678284748/MancoCamp/fup2rmahekuwooaj8nsg.jpg',
                  filename: 'MancoCamp/fup2rmahekuwooaj8nsg',
                },
                {
                  url: 'https://res.cloudinary.com/dk6pstm5m/image/upload/v1678284757/MancoCamp/gnerrwrajzhzeobxfyzr.jpg',
                  filename: 'MancoCamp/gnerrwrajzhzeobxfyzr',
                }
              ],
        })
        await camp.save();
    }      
}

seedDb().then(() => {
    mongoose.connection.close();
})


