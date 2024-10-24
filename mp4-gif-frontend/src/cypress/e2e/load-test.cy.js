describe('Load Test - 100 requests per minute', () => {
  it('Should send 100 requests in 60 seconds', () => {
    const totalRequests = 100;
    const requestInterval = 60000 / totalRequests;
    let requestCount = 0;

    function sendRequest() {
      cy.fixture('test-file.mp4', 'binary').then((fileContent) => {
        const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'video/mp4');
        const formData = new FormData();
        formData.append('file', blob, 'test-file.mp4');
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/convert');
        
        xhr.onload = function () {
          if (xhr.status === 200) {
            // Handle success
            cy.log('Request successful:', xhr.responseText);
          } else {
            // Handle failure
            cy.log('Request failed with status:', xhr.status);
          }
        };

        xhr.onerror = function () {
          // Handle error
          cy.log('Request error');
        };

        // Send the form data with the file
        xhr.send(formData);
      });
      
      requestCount += 1;

      if (requestCount < totalRequests) {
        setTimeout(sendRequest, requestInterval);
      }
    }

    sendRequest();
  });
});
