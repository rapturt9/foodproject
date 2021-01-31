import React from 'react'
import style from './recipe.module.css';

const Recipe = ({value}) => {
    return (
        <div className={style.recipe}>
            <p className={style.distance}><b>Distance:</b> {value.distance} miles</p>
            <p><b>Address:</b> <a target="_blank" href={`https://www.google.com/maps/dir/${value.location[0]},${value.location[1]}/${value.current[0]},${value.current[1]}/`}>{value.address}</a></p>
            <p><b>Description:</b> {value.description}</p>
            {value.food.map((food,i)=>{
                return (<div>
                    <p><b>{food[0]}</b> x {food[1]}</p>
            <p>Estimated Calories: {Math.round(value.recipes[i].hits[0].recipe.calories)}</p>
            <img className={style.image} src={value.recipes[i].hits[0].recipe.image} alt=""/>
                </div>);
            })}
        </div>
    );
}


export default Recipe;