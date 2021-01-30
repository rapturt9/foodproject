import React from 'react'
import style from './recipe.module.css';

const Recipe = ({value}) => {
    return (
        <div className={style.recipe}>
            <p>Distance: {value.distance}</p>
            <p>Address: {value.address}</p>
            <p>Description: {value.description}</p>
            {value.food.map((food,i)=>{
                return (<div>
                    <p>{food[0]} x {food[1]}</p>
            <p>Estimated Calories: {Math.round(value.recipes[i].hits[0].recipe.calories)}</p>
            <img className={style.image} src={value.recipes[i].hits[0].recipe.image} alt=""/>
                </div>);
            })}
        </div>
    );
}


export default Recipe;