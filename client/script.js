const button = document.getElementById('checkout-button')

button.addEventListener('click', ()=> {
  
  fetch('/create-checkout-session',{
    method: "POST",
    headers: {
      "Content-Type": "application/json"

    },
    body: JSON.stringify({items: [{id: 1, quantity: 3}, {id:2, quantity: 2}]})
  }).then(response => {
    if(response.ok) return response.json()
    return response.json().then(json => Promise.reject(json))
  }).then(({url})=> {
    
    window.location = url
  }).catch(error=> {
    console.log(error.message)
  })
}
)