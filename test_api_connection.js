fetch('/api/upload', {
  method: 'POST',
  body: new FormData()
})
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    if (data.error) {
      console.error('API Error:', data.error);
    } else {
      console.log('API Connection Successful!');
    }
  })
  .catch(error => {
    console.error('Fetch Error:', error);
  });