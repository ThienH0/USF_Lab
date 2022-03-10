function get(url) {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      http.onload = function() {
        resolve({ status: http.status, data: JSON.parse(http.response) });
      };
      http.open("GET", url);
      http.send();
    });
}


function post(url, data) {
 data = JSON.stringify(data);
 return new Promise((resolve, reject) => {
   const http = new XMLHttpRequest();
   http.onload = function() {
     resolve({ status: http.status, data: JSON.parse(http.response) });
   };
   http.open("POST", url);
   //Make sure that the server knows we're sending it json data.
   http.setRequestHeader("Content-Type", "application/json");
   http.send(data);
 });
}