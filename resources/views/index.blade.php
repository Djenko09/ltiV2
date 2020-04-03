<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Open</title>

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  @yield('extrastyles')
  <link rel="stylesheet" href="{{ URL::asset('css/app.css') }}">

<style media="screen">
  body {
    overflow-x: hidden;
  }

  #sidebar-wrapper {
    min-height: 100vh;
    margin-left: -15rem;
    -webkit-transition: margin .25s ease-out;
    -moz-transition: margin .25s ease-out;
    -o-transition: margin .25s ease-out;
    transition: margin .25s ease-out;
  }

  #sidebar-wrapper .sidebar-heading {
    padding: 0.875rem 1.25rem;
    font-size: 1.2rem;
  }

  #sidebar-wrapper .list-group {
    width: 15rem;
  }

  #page-content-wrapper {
    min-width: 100vw;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: 0;
  }

  @media (min-width: 768px) {
    #sidebar-wrapper {
      margin-left: 0;
    }

    #page-content-wrapper {
      min-width: 0;
      width: 100%;
    }

    #wrapper.toggled #sidebar-wrapper {
      margin-left: -15rem;
    }
  }
  </style>

</head>

<body>

  <div class="d-flex" id="app">

    <!-- Sidebar -->
    <div  v-if="this.$store.state.token" class="bg-light border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">OpenStack<router-link to="/home" class="navbar-brand"><img src="https://pbs.twimg.com/profile_images/810981601253261312/V1zRfeKR_400x400.jpg" alt="some text" width=60 height=40></router-link></div>
      <div class="list-group list-group-flush">
        <router-link to="/instances" href="#" class="list-group-item list-group-item-action bg-light">Instances</router-link>
        <router-link to="/images" href="#" class="list-group-item list-group-item-action bg-light">Images</router-link>
        <router-link to="/volumes"href="#" class="list-group-item list-group-item-action bg-light">Volumes</router-link>
        <router-link to="/keypairs"href="#" class="list-group-item list-group-item-action bg-light">Key Pairs</router-link>
        <!--<a href="#" class="list-group-item list-group-item-action bg-light">Events</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Profile</a>
        <a href="#" class="list-group-item list-group-item-action bg-light">Status</a>-->
      </div>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div id="page-content-wrapper">

      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">


        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
            <li v-if="!this.$store.state.token" class="nav-item active">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li v-else class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
            <li v-if="this.$store.state.token" class="nav-item">
              <a v-html="this.$store.state.user.name" class="nav-link" href="#"></a>
            </li>
            <li v-if="this.$store.state.token" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Project
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a v-html="this.$store.state.projectName" href="#"></span>
                <!--<a class="dropdown-item" href="#">Another action</a>-->
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div class="container-fluid">
        <router-view>@yield('content')</router-view>
      </div>
    </div>
    <!-- /#page-content-wrapper -->

  </div>
  <!-- /#wrapper -->
    @yield('pagescript')
  <script
			  src="https://code.jquery.com/jquery-3.4.1.js"
			  integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
			  crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script type="text/javascript">

</script>


</body>
<script src="js/app.js"> </script>
</html>
