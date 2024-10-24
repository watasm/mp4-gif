describe('Load Test - 100 requests per minute', () => {
    it('Should send 100 requests in 60 seconds', () => {
      const totalRequests = 100;
      const requestInterval = 60000 / totalRequests;
      let requestCount = 0;
  
      function sendRequest() {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/convert', 
          body: {
            file: 'test-file.mp4', 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
  
        requestCount += 1;
  
        if (requestCount < totalRequests) {
          setTimeout(sendRequest, requestInterval);
        }
      }

      sendRequest();
    });
  });
  