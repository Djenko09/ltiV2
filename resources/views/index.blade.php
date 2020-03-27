<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>OpenStack App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
   
    <!-- Latest compiled and minified CSS & JS -->
    <link rel="stylesheet" href="{{ URL::asset('css/app.css') }}">
</head>

<body>
    <div class="container" id="app">
  
    <nav class="navbar navbar-expand-md navbar-dark bg-secondary fixed-top">
        <router-link class="navbar-brand" to='/'>OpenStack <img src="https://pbs.twimg.com/profile_images/810981601253261312/V1zRfeKR_400x400.jpg" alt="some text" width=60 height=40> </router-link>
     

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">

                </ul>


                <ul class="navbar-nav mr-right" >
                    <li class="form-inline my-2 my-lg-0 nav-item active">
                        <router-link class="nav-link" to="/login">Login</router-link>
                    </li>
                

                </ul>


            </div>
        </nav>

        <div>

            <router-view></router-view>
        </div>

</body>

<script src="js/app.js"> </script>


</html>