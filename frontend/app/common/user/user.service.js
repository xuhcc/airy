function airyUser($http, $state, airyPopup) {
    let user = {};
    let service = {
        user: user,
        userLoaded: load(),
        reload: load,
        login: login,
        logout: logout,
    };
    return service;

    function load() {
        return $http.get('/user').then(response => {
            let data = response.data;
            angular.extend(user, data.user);
        });
    }

    function login(password) {
        $http.post('/login', {password: password}).then(response => {
            let data = response.data;
            if (data.error_msg) {
                airyPopup.alert(data.error_msg);
            } else {
                angular.extend(user, data.user);
                $state.go('client_list');
            }
        });
    }

    function logout() {
        $http.get('/logout').then(response => {
            for (let prop in user) {
                delete user[prop];
            }
            $state.go('login');
        });
    }
}

export default airyUser;
