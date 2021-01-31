import React, { useEffect, useState } from "react";
import Recipe from "./Recipe";
import "./App.css";
import axios from "axios";
console.log(axios.get("https://food1-dc6d.restdb.io/rest/main"));

const App = () => {
  const APP_ID = "969e657a";
  const APP_KEY = "e9372888d5f1beff394b7cf0ba8d1107";
  let info = [
    {
      current:[0,0],
      location: [42.1781, -85.9545],
      description: "Fish and pizza together",
      food: [
        ["fish", 3],
        ["pizza", 2],
      ],
      address: "Address2",
      distance: 0,
      recipes: [],
    },
    {
      current:[0,0],
      location: [42.1781, -88.9545],
      description: "Small chicken pieces inside box",
      food: [["chicken", 1]],
      address: "Address1",
      distance: 0,
      recipes: [],
    },
  ];

  const [values, setValues] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getValues();
  }, [query]);

  const getValues = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      var lat = Math.round(position.coords.latitude * 10000) / 10000;
      var long = Math.round(position.coords.longitude * 10000) / 10000;
      var data = `https://api.radar.io/v1/route/matrix?origins=${lat},${long}&destinations=`;
      for (let i = 0; i < info.length; i++) {
        data += info[i].location[0] + "," + info[i].location[1];
        if (i < info.length - 1) {
          data += "|";
        }
        info[i].current=[lat,long];
      }
      data += "&mode=car&units=imperial"; //42.17814,-87.95432
      let response = await axios.get(data, {
        headers: {
          Authorization: "prj_test_pk_651b972c0915b29bafb4d7a7e6cae946e6c7be4c",
        },
      });
      await response.data.matrix[0].map(async (item, i) => {
        info[i].distance = Math.round(item.distance.value / 5280);
        let reverse = await axios.get(
          "https://api.radar.io/v1/geocode/reverse?coordinates=" +
            lat +
            "," +
            long,
          {
            headers: {
              Authorization:
                "prj_test_pk_651b972c0915b29bafb4d7a7e6cae946e6c7be4c",
            },
          }
        );
        info[i].address = reverse.data.addresses[0].formattedAddress;
      });
      for (let i = 0; i < info.length; i++) {
        for (let j = 0; j < info[i].food.length; j++) {
          let response = await fetch(
            `https://api.edamam.com/search?q=${info[i].food[j][0]}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=1`
          );
          const data = await response.json();
          info[i].recipes.push(data);
          console.log(data);
        }
      }
      await info.sort((a, b) => (a.distance > b.distance ? 1 : -1));
      console.log(info);
      setValues(info);
    });
  };
  const getSearch = e => {
    e.preventDefault();
    setQuery(search);
  }

  const updateSearch = e => {
    setSearch(e.target.value)
  }

  console.log(query);

  return (
    <div className="App">
      <h1 className="title">NutriPick</h1>
      <form onSubmit={getSearch} className="search-form">
        <input type="text" className="search-bar" value={search} onChange={updateSearch} />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      <div className="recipes">
        {values.map((value, i) => {
          var bool = false;
          /*for(let j=0;j<value.food.length;j++){
            if(value.food[0]===query){  
              bool=true;
            }
          }*/
          if(i==0){
            bool = true;
          }
          if(query===""||bool){
            return <Recipe key={i} value={value} />;
          }
          return;
        })}
      </div>
      <div className="form">
      <h3 className="add-item">Add New Item</h3>
        <input type="text" className="new-item" placeholder="Name of Items" />
        <input type="text" className="new-item" placeholder="Description" />
        <button className="add-button" onClick={() => {
          setQuery("")
        }}>
          Add New Item
        </button>
      </div>
    </div>
  );
};

export default App;
