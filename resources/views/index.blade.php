<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>OpenStack</title>

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  @yield('extrastyles')
  <link rel="stylesheet" href="{{ URL::asset('css/app.css') }}">
  <script src="https://use.fontawesome.com/1bce9209b1.js"></script>



<style media="screen">
  body {
    overflow-x: hidden;
  }

  .form-control {
  height: auto !important;
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
      <div class="sidebar-heading"><router-link to="/home" class="navbar-brand"><img src="{{URL::asset('/images/logo.png')}}" alt="some text" width=200 height=100/></router-link></div>
      <div class="list-group list-group-flush">
        <p>
        <a class="list-group-item list-group-item-action btn-outline-secondary  dropdown-toggle" data-toggle="collapse" href="#multiCollapseProject" role="button" aria-expanded="false" aria-controls="multiCollapseProject"
        role="button" aria-pressed="true">Project</a>
        </p>
        <div class="row">
          <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseProject">
              <p>
              <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseCompute" role="button" aria-expanded="false" aria-controls="multiCollapseCompute" role="button" aria-pressed="true"
              style="text-align:center">Compute</a>
              </p>
              <div class="row">
                <div class="col">
                  <div class="collapse multi-collapse" id="multiCollapseCompute">
                    <div>
                      <router-link to="/instances" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Instances</router-link>
                      <router-link to="/containers" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Containers</router-link>
                      <router-link to="/images" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Images</router-link>
                      <router-link to="/keyPairs" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Key Pairs</router-link>
                      <router-link to="/serverGroup" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Server Groups</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <p>
              <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseVolumes" role="button" aria-expanded="false" aria-controls="multiCollapseVolumes" role="button" aria-pressed="true" style="text-align:center">Volumes</a>
              </p>
              <div class="row">
                <div class="col">
                  <div class="collapse multi-collapse" id="multiCollapseVolumes">
                    <div>
                      <router-link to="/volumes" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Volumes</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <p>
              <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseNetwork" role="button" aria-expanded="false" aria-controls="multiCollapseNetwork" role="button" aria-pressed="true" style="text-align:center" >Network</a>
              </p>
              <div class="row">
                <div class="col">
                  <div class="collapse multi-collapse" id="multiCollapseNetwork">
                    <div>
                      <router-link to="/networks" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Networks</router-link>
                      <router-link to="/routers" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Routers</router-link>
                      <router-link to="/securityGroups" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Security Groups</router-link>
                      <router-link to="/floatingIPs" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Floating IPs</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="this.$store.state.user.name == 'admin'" class="list-group list-group-flush">
        <p>
        <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseAdmin" role="button" aria-expanded="false" aria-controls="multiCollapseAdmin">Admin</a>
        </p>
        <div class="row">
          <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseAdmin">
              <p>
              <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseComputeAdmin" role="button" aria-expanded="false" aria-controls="multiCollapseCompute" role="button" aria-pressed="true"
              style="text-align:center">Compute</a>
              </p>
              <div class="row">
                <div class="col">
                  <div class="collapse multi-collapse" id="multiCollapseComputeAdmin">
                    <div>
                      <router-link to="/flavors" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:right">Flavors</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <div class="list-group list-group-flush">
        <a class="list-group-item list-group-item-action bg-light dropdown-toggle" data-toggle="collapse" href="#multiCollapseIdentity" role="button" aria-expanded="false" aria-controls="multiCollapseIdentity">Identity</a>
        </p>
        <div class="row">
          <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseIdentity">
              <div>
                <!--<router-link v-if="this.$store.state.user.name == 'admin'"to="/instances" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Domains</router-link>-->
                <router-link to="/projects" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Projects</router-link>
               <!-- <router-link to="/images" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Users</router-link>
                <router-link v-if="this.$store.state.user.name == 'admin'"to="/instances" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Groups</router-link>
                <router-link v-if="this.$store.state.user.name == 'admin'"to="/instances" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Roles</router-link>
                <router-link to="/volumes" href="#" class="list-group-item list-group-item-action bg-light" style="text-align:center">Aplication Credentials</router-link> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="list-group list-group-flush">
        <a class="list-group-item list-group-item-action bg-light" data-toggle="collapse" href="#multiCollapseSettings" role="button" aria-expanded="false" aria-controls="multiCollapseSettings">Settings</a>
        </p>
        <div class="row">
          <div class="col">
            <div class="collapse multi-collapse" id="multiCollapseSettings">
              <div>
                <router-link to="/instances" href="#" class="list-group-item list-group-item-action bg-light">User Settings</router-link>
                <router-link to="/images" href="#" class="list-group-item list-group-item-action bg-light">Change Password</router-link>
                <router-link to="/volumes" href="#" class="list-group-item list-group-item-action bg-light">Volumes</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>-->
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
            <li v-if="this.$store.state.token" class="nav-item">
              <a v-html="this.$store.state.user.name" class="nav-link" href="#"></a>
                <i class="fa fa-user" aria-hidden="true"></i>
            </li>
            <li v-if="this.$store.state.token" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-html="this.$store.state.projectName">
              </a>

              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <div v-for="project in this.$store.state.projectNames" :key="project.id">
                    <router-link :to="{name: 'changeProj', params: {projectName: project.name}}" class="dropdown-item" v-html="project.name" style="text-align:center" href="#"></router-link>
                </div>
                <!--<a class="dropdown-item" href="#">Something else here</a>-->
              </div>

            </li>
            <li v-if="!this.$store.state.token" class="nav-item active">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li v-else class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
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

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD1_kwpSRCY6EIkT2aYBdPENRN3Qvco16o&libraries=visualization&callback=initMap">
</script>


</body>
<script src="js/app.js"> </script>
</html>
