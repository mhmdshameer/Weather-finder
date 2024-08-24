import express from "express";
import axios from "axios";
import env from "dotenv"

const app = express();
const port = 3000;
env.config();

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
    res.render("index.ejs", {temp: null , icon: null, cityName:null, description:null});

})

app.post("/submit", async (req, res) =>{
    const apiKey = process.env.API_key;
    const city = req.body.city;
    
    if(city){
          try {
            const celsius = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            console.log(celsius.data);
            const temp = Math.round(celsius.data.main.temp - 273.15);
            const iconCode = celsius.data.weather[0].icon;
            const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const cityName = celsius.data.name;
            const description = celsius.data.weather[0].description;
            res.render("index.ejs",{ temp : temp+"°C", icon:icon, cityName:cityName, description:description});

        }catch(err){ 
           console.log(err);
        }
    }else{
        res.status(400).send("Enter city name");
    }
})

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
})