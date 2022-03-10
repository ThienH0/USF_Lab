const userIdDoc = document.getElementById('userId');
const userScoreDoc = document.getElementById('userScore');
const updateScore = document.getElementById('updateScore');
let userId = '';
let userScore = '';

window.onload = function () {
    const url = document.location.href;
    let   params = url.split('?')[1].split('&'), data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    userId = data.userId;
    if(userId.length > 0){
        get(`http://basic-web.dev.avc.web.usf.edu/${userId}`).then(function(response){
            //Put all code that relies on the data from this request in here.
            if(response.status == 200){
              userId= response.data.id; //The username that was requested. In this case it is "myUserName".
              userScore = response.data.score; //The user's current score.

              userIdDoc.innerHTML = userId;
              userScoreDoc.innerHTML = fizzBuzzFunction(userScore);
            }
            else{
              //User "myUserName" not found.
              //response.data is null
              post(`http://basic-web.dev.avc.web.usf.edu/${userId}`, { score: 0 }).then(function(response){
                   switch(response.status){
                     case 201:
                      userId = response.data.id;
                      userScore = response.data.score;

                      userIdDoc.innerHTML = userId;
                      userScoreDoc.innerHTML = fizzBuzzFunction(userScore);
                      break;
                     case 400:
                       //Bad request. Most likely your data that you sent (in this case dataToSend) was formatted incorrectly, or you supplied a negative score value.
                      console.error(response.data);
                       break;
                     case 500:
                       //Something went wrong on the server, such as the database got deleted somehow. This should never happen.
                       console.error(response.data);
                       break;
                   }
                 });; //create a new user.
           }
        });
    }
    
}

updateScore.addEventListener('click', ()=> {
    let newScore = parseInt(userScore) + 1;
    if(newScore > 100){
        alert('Your Score is 100 and can not over 100');
        updateScore.disabled = true;
    }
    else{ post(`http://basic-web.dev.avc.web.usf.edu/${userId}`, {score: newScore}).then(function(response){
        switch(response.status){
          case 200:
            //User was updated successfully.
            //response.data will be the same as returned by get(), and should contain the updated data.
           userScore = response.data.score;
           break;
         case 201:
            //A new user was successfully created. Otherwise same as status 200.
           userScore = response.data.score;
            break;
         case 400:
          //Bad request. Most likely your data that you sent (in this case dataToSend) was formatted incorrectly, or you supplied a negative score value.
          //response.data will be: { Error: "error message" }
           console.error(response.data);
            break;
         case 500:
           //Something went wrong on the server, such as the database got deleted somehow. This should never happen.
           //response.data will be the same as status 400.
           console.error(response.data);
           break;
       }
       userIdDoc.innerHTML = userId;
       userScoreDoc.innerHTML = fizzBuzzFunction(userScore);
     });
    }
   
})

fizzBuzzFunction = (number) =>{
    if(number == 0){
        return number;
    }else if(number % 3 == 0 && number % 5 == 0){
        return 'FizzBuzz';
    }else if(number %3 == 0){
        return 'Fizz';
    }else if(number % 5 == 0){
        return 'Buzz';
    }else{
        return number;
    }
}