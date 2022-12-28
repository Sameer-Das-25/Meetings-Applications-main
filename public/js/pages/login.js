const login = async (loginDetails) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(loginDetails);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/auth/login`, requestOptions);

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || 'Some error occured');
    }
    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    localStorage.setItem('name', data.name);
    localStorage.setItem('message', data.message);
    return data;
};

const isValid = (data) => {
    const email = data.email;
    const password = data.password;
    if (email == '') {
        alert('Email field requird');
        return false;
    }
    if (password == '') {
        alert('Password field requird');
        return false;
    }
    return true;
};

async function onLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value; //email
    const password = document.getElementById('password').value; //password

    const loginDetails = { email, password };

    try {
        const data = await login(loginDetails);
        alert(`${localStorage.getItem('name')} ${localStorage.getItem('message')}`);
        location.href = 'calender.html';
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Login');
    document.querySelector('#login-form').addEventListener('submit', onLoginFormSubmit);
});
