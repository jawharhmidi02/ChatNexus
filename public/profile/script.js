document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    
    formData.append('profilePicture', fileField.files[0]);
  
    const userId = 'jawhar01';

    console.log(formData)
  
    try {
      const response = await axios.post(`/api/accounts/uploadprofilepicture/${userId}&12345678`, formData);
  
      console.log(response);
  
    //   if (response.ok) {
    //     document.getElementById('message').textContent = 'Profile picture uploaded successfully!';
    //   } else {
    //     document.getElementById('message').textContent = `Error: ${result.message}`;
    //   }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'An error occurred while uploading the profile picture.';
    }
  });