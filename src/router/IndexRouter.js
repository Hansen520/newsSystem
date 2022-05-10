import React from 'react'
import { Redirect,Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
    return (
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/" render={() => 
                localStorage.getItem('token')?
                <NewsSandBox></NewsSandBox>:
                <Redirect to="/login"/>
            }></Route>
        </Switch>
        
    )
}