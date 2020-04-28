import React, { Component, useEffect, useState, useReducer } from 'react';
import './meal_history.css';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';


const Meal_History = (props) =>{
    const history = useHistory();
    const token = localStorage.getItem('jwtToken');
    console.log(token, " token is here");

    if (!token){
        history.push('/login');
    }
  
    const [sampleFilter, setFilter] = useState('all');
    const [sampleRestaurants, setSampleRestaurants] = useState([]);
    const [sampleRestaurants2, setSampleRestaurants2] = useState([]);

    useEffect (() =>{
        axios.get('./meal_history')
        .then(res =>{
            console.log(res);
            const parsed = res.data;
            console.log(parsed);
            const resRests = parsed.map(r =>{
                let tempDate = r.date; //r.dateMonth.toString() + "/" + r.dateDay.toString() + "/" + r.dateYear.toString();
                return{
                    id: r.id,
                    name: r.name,
                    address: r.location,
                    date: tempDate
                }
            })
            console.log(resRests);
            setSampleRestaurants(resRests);
            setSampleRestaurants2(resRests);
            console.log(sampleRestaurants);
        })
    }, []);

    function handleDelete(item_id) {
        axios.post('./meal_history_delete', {id: item_id})
            .then(res => {
                console.log('deleted');
                for(let i=0; i<sampleRestaurants.length; i++){
                    if(sampleRestaurants[i].id === item_id){
                        sampleRestaurants.splice(i, 1);
                    }
                }
                window.location.reload();
            })
    };

    const handleChange = (event) => {
        setFilter(event.target.value);
    }

    const handleFilter = (event) => {
        let d = new Date();
        d = d.toLocaleDateString();
        console.log(d);
        const dateData = d.slice('/');
        let results = [];

        switch (sampleFilter) {
            case "all" : 
                setSampleRestaurants(sampleRestaurants2);
                break;
            case "year" :
                for(let i = 0; i < sampleRestaurants2.length; i++){
                    if(sampleRestaurants2[i].date.slice('/')[2] === dateData[2]){
                        results.push(sampleRestaurants2[i]);
                    }
                }
                setSampleRestaurants(results);
                break;
            case "month":
                for(let i = 0; i < sampleRestaurants2.length; i++){
                    if(sampleRestaurants2[i].date.slice('/')[2] === dateData[2]){
                        if(sampleRestaurants2[i].date.slice('/')[0] === dateData[0]){
                            results.push(sampleRestaurants2[i]);
                        }
                    }
                }
                setSampleRestaurants(results);
                break;
            case "day":
                for(let i = 0; i < sampleRestaurants2.length; i++){
                    if(d === sampleRestaurants2[i].date){
                        results.push(sampleRestaurants2[i]);
                    }
                }
                setSampleRestaurants(results);
                break;
        }


    }


        return(
            <div id="parent">
            <h1 className="meal_h">Meal History</h1>
            <p className="meal_p">Viewing history from: All Time</p>
            
            <div id="meal_table">
                <label for="time_frames" id="time_f"> View entries from: </label>
                <select id="time_frames" name="time_frames" onChange={handleChange}>
                    <option value="all">All Time</option>
                    <option value="year">This Year</option>
                    <option value="month">This Month</option>
                    <option value="day">Today</option>
                    </select>
                    <input className="option_button" type="submit" onClick={handleFilter}></input>
            </div>
            



			<div className="rest_history">
				{sampleRestaurants.map(item => (
					<div className="rest_card" key={item.id}>
                        <div className="dateTR">{item.date}</div>
						<div className="restNameList">{item.name}</div>
						{item.address}<br />
                        <button  type="submit" className="option_button" id= {item.id} onClick={() => handleDelete(item.id)}>Delete Entry</button>
					</div>
				))}
			</div>
		</div>


    )
    }
   

export default Meal_History;